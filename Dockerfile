# ============================================================================
# ASRS 緊急災害影像探索器（disaster-imagery-explorer）— 生產級多階段 Dockerfile
#
# 重要：本專案為 webpack 5 建置（非 Vite），環境變數注入機制是
# 「dotenv 讀 .env 檔 → webpack DefinePlugin 內嵌成 ENV_* 全域常數」
# （見 webpack/loadEnvironmentVariables.js、webpack/getGlobalConstants.js、
#  webpack.config.js）。webpack 编译期直接讀取專案根目錄的 .env 檔案本身
# （不是 process.env），因此無法沿用 Vite 專案「ARG → ENV → import.meta.env」
# 的做法，必須在 builder stage 內把 build-arg 寫成一份 .env 檔案再執行
# `npm run build`。
#
# 必要變數（見 webpack/config.js 的 ENV_VARIABLES_BY_APP_NAME.disasterimageryexplorer）：
#   DISASTER_IMAGERY_EXPLORER_APP_ID   （必要，可留空字串）
#   DISASTER_RESPONSE_SERVICE_URL      （必要，建議填實際 ImageServer URL）
# 選填變數：
#   ARCGIS_PORTAL_ROOT_URL
#   IMAGERY_EXPLORER_WEB_MAP_ID
#
# 建置範例：
#   docker build -t asrs-disaster-explorer \
#     --build-arg DISASTER_RESPONSE_SERVICE_URL=https://.../ImageServer \
#     --build-arg ARCGIS_PORTAL_ROOT_URL=https://your-portal.example.com/geoportal .
# ============================================================================

# ---- Stage 1：建置（node LTS alpine） ----
FROM node:22-alpine AS builder

WORKDIR /app

# 先複製依賴清單以善用 layer cache
COPY package.json package-lock.json ./
# --ignore-scripts：跳過 husky 的 prepare（容器內無 .git，install 會失敗）
RUN npm ci --ignore-scripts

COPY . .

# 建置期變數：webpack 是透過 dotenv 讀取專案根目錄的 .env 檔案本身，
# 而非直接讀 process.env，因此收到 ARG 後要寫成 .env 檔（覆蓋掉任何
# 隨原始碼複製進來的同名檔），npm run build 才吃得到。
ARG DISASTER_IMAGERY_EXPLORER_APP_ID=
ARG DISASTER_RESPONSE_SERVICE_URL=
ARG ARCGIS_PORTAL_ROOT_URL=
ARG IMAGERY_EXPLORER_WEB_MAP_ID=

RUN { \
        echo "DISASTER_IMAGERY_EXPLORER_APP_ID=${DISASTER_IMAGERY_EXPLORER_APP_ID}"; \
        echo "DISASTER_RESPONSE_SERVICE_URL=${DISASTER_RESPONSE_SERVICE_URL}"; \
        echo "ARCGIS_PORTAL_ROOT_URL=${ARCGIS_PORTAL_ROOT_URL}"; \
        echo "IMAGERY_EXPLORER_WEB_MAP_ID=${IMAGERY_EXPLORER_WEB_MAP_ID}"; \
    } > .env

# package.json 的 build script 已固定 --env app=disasterimageryexplorer --env envFileName=.env
RUN npm run build

# ---- Stage 2：服務（nginx alpine，只帶靜態產物） ----
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# webpack output.path 為 ./dist/<app>，本專案固定只建置 disasterimageryexplorer，
# 產物（含 index.html）直接落在該子目錄下，需整包搬到 nginx html root，
# 讓 index.html 內的相對路徑資產參照（如 main.<hash>.js）在網站根目錄下正確解析。
COPY --from=builder /app/dist/disasterimageryexplorer /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
