# SBOM 軟體物料清單（Software Bill of Materials）

> 專案：航測及遙測分署影像探索平台（imagery-explorer-apps fork）
> 產出日期：2026-07-12
> 版本依據：`package-lock.json` 實際安裝版本（node_modules 驗證）
> 格式參考：NTIA Minimum Elements for an SBOM

## 說明

- **供應商**欄標示套件發佈者；`個人` 表示由個人 npm 帳號發佈（非組織帳號），資安上須額外留意升級 diff。
- **執行環境**：`runtime` = 打包進最終網頁交付使用者瀏覽器；`build` = 僅建置/開發階段使用，不進入交付產物。
- 完整傳遞依賴（transitive dependencies）清單可由 `npm sbom --sbom-format cyclonedx` 或 `npm ls --all` 產出；本表列直接依賴（direct dependencies）。

---

## 1. 執行期依賴（Runtime Dependencies — 打包進交付產物）

| # | 套件名稱 | 版本 | 授權 | 供應商 | 用途 | 資安備註 |
|---|----------|------|------|--------|------|----------|
| 1 | @arcgis/core | 5.1.8 | Esri Master License | Esri | ArcGIS Maps SDK：地圖、ImageryLayer、MosaicRule、MediaLayer | 核心 GIS 引擎；升級須完整回歸測試 |
| 2 | @arcgis/map-components | 5.1.8 | Esri Master License | Esri | ArcGIS Web Components | 與 @arcgis/core 版本須一致 |
| 3 | @esri/arcgis-rest-feature-service | 4.0.4 | Apache-2.0 | Esri | FeatureServer REST 查詢 | |
| 4 | @esri/calcite-components | 5.1.1 | Apache-2.0 | Esri | Esri 設計系統 UI 元件（loader、slider…） | |
| 5 | @reduxjs/toolkit | 2.5.0 | MIT | Redux 團隊 | 全域狀態管理 | |
| 6 | @vannizhang/images-to-video-converter-client | 1.1.14 | 未明示 | **個人**（Esri 工程師） | 上游動畫 MP4 轉檔 client | ⚠️ 鎖 arcgis.com 網域、依賴 Esri 私有後端；**分署應用已改用瀏覽器原生 MediaRecorder，可評估移除此依賴** |
| 7 | @vannizhang/react-d3-charts | 1.0.38 | 未明示 | **個人**（Esri 工程師） | D3 圖表（上游分析工具用） | 分署應用已移除分析模式，僅上游程式引用 |
| 8 | classnames | 2.2.6 | MIT | 社群 | CSS class 條件組合 | |
| 9 | date-fns | 2.30.0 | MIT | 社群 | 日期處理 | |
| 10 | date-fns-tz | 2.0.0 | MIT | 社群 | 時區處理（UTC 顯示） | |
| 11 | helper-toolkit-ts | 1.2.1 | 未明示 | **個人**（Esri 工程師） | 雜項工具（裝置偵測等） | |
| 12 | i18next | 24.2.3 | MIT | i18next | 多語系框架 | |
| 13 | i18next-http-backend | 3.0.6 | MIT | i18next | 翻譯檔 HTTP 載入（public/locales/） | |
| 14 | jszip | 3.10.1 | MIT/GPLv3 雙授權 | 社群 | ZIP 打包（上游下載功能用） | |
| 15 | nanoid | 5.0.9 | MIT | 社群 | 唯一 ID 產生（動畫幀 uniqueId） | |
| 16 | react | 19.1.1 | MIT | Meta | UI 框架 | |
| 17 | react-dom | 19.1.1 | MIT | Meta | React DOM 渲染 | |
| 18 | react-i18next | 15.4.1 | MIT | i18next | React i18n 綁定 | |
| 19 | react-redux | 9.2.0 | MIT | Redux 團隊 | React-Redux 綁定 | |
| 20 | redux | 5.0.1 | MIT | Redux 團隊 | 狀態容器 | |

## 2. 建置期依賴（Build/Dev Dependencies — 不進入交付產物）

| # | 套件名稱 | 版本 | 授權 | 用途 |
|---|----------|------|------|------|
| 1 | typescript | 5.9.3 | Apache-2.0 | 型別檢查與編譯 |
| 2 | webpack | 5.108.3 | MIT | 模組打包 |
| 3 | webpack-cli | 6.x | MIT | Webpack 指令列 |
| 4 | webpack-dev-server | 5.2.5 | MIT | 本機 HTTPS 開發伺服器 |
| 5 | @babel/core | 7.29.7 | MIT | JS/TS 轉譯 |
| 6 | @babel/preset-env / preset-react / preset-typescript | 7.x | MIT | Babel 預設集 |
| 7 | babel-loader | 10.x | MIT | Webpack Babel 整合 |
| 8 | tailwindcss | 3.3.5 | MIT | Utility CSS 框架 |
| 9 | postcss / autoprefixer / postcss-loader / postcss-preset-env | 8.x/10.x | MIT | CSS 後處理 |
| 10 | css-loader / style-loader / mini-css-extract-plugin / css-minimizer-webpack-plugin | — | MIT | CSS 打包鏈 |
| 11 | html-webpack-plugin | 5.6.3 | MIT | HTML 產生 |
| 12 | html-loader | 5.x | MIT | HTML 資源載入 |
| 13 | copy-webpack-plugin | 14.0.0 | MIT | 靜態檔複製 |
| 14 | terser-webpack-plugin | 5.x | MIT | JS 壓縮 |
| 15 | fork-ts-checker-webpack-plugin | 9.x | MIT | 平行 TS 型別檢查 |
| 16 | source-map-loader | 5.x | MIT | Source map 處理 |
| 17 | webpack-bundle-analyzer | 4.x | MIT | Bundle 體積分析 |
| 18 | dotenv | 16.4.5 | BSD-2-Clause | .env 環境變數載入 |
| 19 | eslint | 8.54.0 | MIT | 靜態程式碼檢查 |
| 20 | @typescript-eslint/parser / eslint-plugin | 6.12 | MIT/BSD | TS ESLint 支援 |
| 21 | eslint-plugin-react / eslint-config-prettier | 7.x/8.x | MIT | React 規則 / Prettier 相容 |
| 22 | prettier | 3.6.2 | MIT | 程式碼格式化 |
| 23 | jest / jest-environment-jsdom | 29.7.0 | MIT | 單元測試 |
| 24 | @testing-library/react | 16.3.0 | MIT | React 元件測試 |
| 25 | @playwright/test | 1.57.0 | Apache-2.0 | E2E 測試（上游應用用） |
| 26 | husky | 8.0.1 | MIT | Git hooks（pre-commit） |
| 27 | lint-staged | 17.x | MIT | 暫存區檔案 lint |
| 28 | ts-node | 10.9.1 | MIT | TS 直接執行 |
| 29 | @types/*（react、node、jest 等） | — | MIT | 型別定義 |

## 3. 依賴覆蓋（Overrides）

| 套件 | 覆蓋版本 | 原因 |
|------|----------|------|
| uuid | ^11.1.1 | 修補傳遞依賴之舊版 uuid 弱點，**勿移除** |

## 4. 外部執行期服務（Runtime External Services）

SBOM 之外，交付產物執行時會連線以下外部端點，防火牆與資安監控應納入清單：

| 端點 | 用途 | 資料方向 |
|------|------|----------|
| `https://edi.asrs.gov.tw/geoportal/...` | DMC III / FS8 ImageServer（影像查詢與匯出） | 下載影像；查詢參數上行 |
| `https://js.arcgis.com`（如採 CDN） | ArcGIS SDK 資源（字型、worker） | 下載 |
| `https://livingatlas.arcgis.com/sentinel2explorer/` | Sentinel-2 iframe 包裝頁內嵌來源 | iframe 載入 |
| `https://static.arcgis.com` / `https://basemaps.arcgis.com` | 底圖服務 | 下載圖磚 |

> ✅ 動畫 MP4 產生完全於使用者瀏覽器本地執行（MediaRecorder API），**無**影像資料上傳至第三方服務。

## 5. SBOM 維護程序建議

1. 每次 `npm install` 變更依賴後，重新產出本表或執行：
   ```bash
   npm sbom --sbom-format cyclonedx > sbom-cyclonedx.json   # 機讀格式（含全部傳遞依賴）
   npm audit --production                                    # 弱點掃描
   ```
2. 建議在 CI 加入 `npm audit --audit-level=high` 作為建置門檻。
3. 個人帳號發佈之套件（`@vannizhang/*`、`helper-toolkit-ts`）升級時人工檢視原始碼 diff。
4. 弱點通報比對：以 CycloneDX JSON 匯入分署弱點管理平台定期比對 CVE。
