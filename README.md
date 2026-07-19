# ASRS 緊急災害影像探索器（asrs-disaster-explorer）

農業部林業及自然保育署 航測及遙測分署（ASRS）緊急災害影像線上介接服務之正式前端。

> 本 repo 原始內容備份於 `backups/README.md.2026-07-19.bak`（Esri 原版多應用 README）。

## 專案定位

本專案是「緊急災害影像採購」專案下的正式對外前端，讓第一線人員能快速查找、比對、分析災前災後衛星／航空影像，
以加速人道救援與復原決策。介面基於 ArcGIS Maps SDK for JavaScript，資料來源為災害應變影像服務（ImageServer）。

## 與原始開源專案的差異（精簡摘要）

本專案 fork 自 Esri Living Atlas 團隊的開源專案
[Esri/imagery-explorer-apps](https://github.com/Esri/imagery-explorer-apps)（Apache-2.0 授權）。
原始 repo 是一個 monorepo，以 webpack `--env app=<名稱>` 切換建置六個獨立應用
（Landsat Explorer、Sentinel-2 Explorer、Sentinel-1 Explorer、Sentinel-2 Land Cover Explorer、
NLCD Land Cover Explorer、Disaster Imagery Explorer）。本專案已完成精簡與驗收，僅保留：

- **`src/` 原始碼**：只留 `disaster-imagery-explorer` 一個應用進入點與其相依的 `shared/`；
  Landsat / Sentinel-1 / Sentinel-2 / Land Cover / NLCD 各應用之進入點與專屬元件已移除。
- **`package.json` build/start script**：只留 `start` / `start:dev` / `start:prod` /
  `build` / `build:dev` / `build:prod`，皆固定 `--env app=disasterimageryexplorer`；
  原本針對其他五個應用的建置指令已移除。
- **環境變數**：`.env.example` 只列出 disaster-imagery-explorer 實際會用到的四個變數
  （見下方「環境變數」一節），不再包含 Landsat／Sentinel／LandCover／NLCD 專屬變數。
- **依賴套件**：`package.json` 的 dependencies/devDependencies 已對應精簡至此應用實際需要的套件。

> 註：`docker-compose.yml`、`Dockerfile.dev`、`MAC_DOCKER_SETUP.md`、
> `.github/workflows/deploy.yml` 為更早期（分署多應用版本，對應另一個
> `ASRS_imagery-explorer-apps` monorepo）遺留檔案，內容引用的 `npm run start:dmc` /
> `build:dmc` / `build:fs8` 等指令**已不存在於本專案的 `package.json`**，執行會失敗；
> 本次僅新增/改寫生產部署所需的 `Dockerfile`、`nginx.conf`、`docker-compose.yml`、
> `.github/workflows/docker-publish.yml`，未清理其餘遺留檔案，詳見文末「已知事項」。

## 環境變數

複製 `.env.example` 為 `.env` 後依實際環境調整：

| 變數 | 必要性 | 說明 |
|---|---|---|
| `DISASTER_IMAGERY_EXPLORER_APP_ID` | 必要（可留空字串） | ArcGIS Portal 上對應此 App 的 Item ID；留空仍可運作，僅無法記錄使用量 |
| `DISASTER_RESPONSE_SERVICE_URL` | 必要 | 災害應變影像服務（ImageServer）URL |
| `ARCGIS_PORTAL_ROOT_URL` | 選填 | ArcGIS Portal 根網址，供搜尋／儲存等功能組合服務網址使用 |
| `IMAGERY_EXPLORER_WEB_MAP_ID` | 選填 | 底圖 WebMap ID，留空則使用程式內建預設底圖 |

「必要」的判準來自 `webpack/config.js` 的 `ENV_VARIABLES_BY_APP_NAME.disasterimageryexplorer`：
build 時只檢查該變數的鍵是否存在於 `.env`（值可為空字串），並非檢查非空。

webpack 是透過 `dotenv` 在**建置期**讀取專案根目錄的 `.env` 檔案本身（見
`webpack/loadEnvironmentVariables.js`），再由 `webpack/getGlobalConstants.js` 以
`DefinePlugin` 內嵌成 `ENV_*` 開頭的全域常數供程式碼使用；因此修改 `.env` 後必須重新
`npm run build`（或重新 `docker build`）才會生效，執行期（runtime）修改環境變數不會有作用。

## 本地開發

```sh
npm install
cp .env.example .env   # 依實際環境填入 DISASTER_RESPONSE_SERVICE_URL 等變數
npm start               # 啟動 https://localhost:8080（webpack dev server，含自簽憑證）
```

建置生產版靜態檔（輸出至 `dist/disasterimageryexplorer/`）：

```sh
npm run build
```

## Docker

### 建置與執行（本地驗證）

```sh
docker build -t asrs-disaster-explorer \
  --build-arg DISASTER_RESPONSE_SERVICE_URL=https://.../ImageServer \
  --build-arg ARCGIS_PORTAL_ROOT_URL=https://your-portal.example.com/geoportal .
docker run -p 8080:80 asrs-disaster-explorer
```

或使用 docker compose（見 `docker-compose.yml`）：

```sh
docker compose up --build
```

瀏覽 <http://localhost:8080>。

### 架構說明

- **Stage 1（builder，`node:22-alpine`）**：`npm ci --ignore-scripts`（容器內無 `.git`，
  跳過 husky prepare）→ 依 build-arg 產生 `.env` → `npm run build`。
- **Stage 2（`nginx:alpine`）**：只帶 `dist/disasterimageryexplorer/` 產物與 `nginx.conf`，
  對外 expose port 80。
- `nginx.conf`：SPA history fallback、gzip、依副檔名分級快取（js/css/字型長效
  immutable、圖片中等快取、`index.html` 不快取）、基本安全 headers，並保留
  `/api/` 反向代理範本（註解停用，供未來對接 ASRS 內部 API 使用）。

## CI/CD（GitHub Actions → Docker Hub）

`.github/workflows/docker-publish.yml`：push 到 `main` 時自動建置並推送 image 至 Docker Hub，
打 `latest` 與 `git commit SHA` 兩個 tag。

**設定步驟**（Repo Settings → Secrets and variables → Actions）：

1. **Secrets**
   - `DOCKERHUB_USERNAME`：Docker Hub 帳號
   - `DOCKERHUB_TOKEN`：Docker Hub Access Token（**勿用密碼**）
2. **Variables**（建置期變數，經 build-arg 注入；未設定則為空字串）
   - `DISASTER_IMAGERY_EXPLORER_APP_ID`
   - `DISASTER_RESPONSE_SERVICE_URL`
   - `ARCGIS_PORTAL_ROOT_URL`
   - `IMAGERY_EXPLORER_WEB_MAP_ID`

## 已知事項

- `docker-compose.yml`、`Dockerfile.dev`、`MAC_DOCKER_SETUP.md`、
  `.github/workflows/deploy.yml` 為舊多應用版本遺留檔案，`docker-compose.yml` 已於本次改寫為
  生產部署驗證用途（原內容備份於 `backups/docker-compose.yml.2026-07-19.bak`），其餘檔案未清理，
  `deploy.yml` 中引用的 `npm run build:dmc` / `build:fs8` 指令目前會執行失敗。
- `docs/01-架構說明與維護手冊.md` 等文件仍描述較早期的 DMC/FS8/Sentinel-2 多應用架構，
  與本 repo 目前僅含 disaster-imagery-explorer 單一應用的實際狀態不完全一致，建議另行更新。

## Vantor Open Data Program Imagery Licensing

- Source Imagery (Vantor) — Vantor releases before and after satellite imagery into the public
  domain under a [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.en)
  license.
- Disaster Imagery Service (Esri) — Licensed under the Esri Master License Agreement.
  [View Summary](https://downloads2.esri.com/arcgisonline/docs/tou_summary.pdf) |
  [View Terms of Use](https://www.esri.com/en-us/legal/terms/full-master-agreement)

## Licensing

本專案基於 [Esri/imagery-explorer-apps](https://github.com/Esri/imagery-explorer-apps)
（Apache License 2.0）修改，授權條款詳見 `LICENSE`。
