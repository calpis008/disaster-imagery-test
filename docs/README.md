# 文件總覽 — 航測及遙測分署影像探索平台

> 本目錄為委外開發、維運與資安廠商的文件入口。
> 最後更新：2026-07-12

## 文件索引

| 文件 | 適用對象 | 內容 |
|------|----------|------|
| [01-架構說明與維護手冊.md](01-架構說明與維護手冊.md) | 開發／維運工程師 | 完整技術架構、目錄結構、Redux 資料流、MosaicRule 機制、客製化模組說明、CI/CD、常見維護工作、技術決策記錄 |
| [02-SBOM軟體物料清單.md](02-SBOM軟體物料清單.md) | 資安人員 | 直接依賴套件清單（含版本、授權、供應商、風險備註）、外部服務端點、SBOM 維護程序 |
| [03-使用者操作手冊.md](03-使用者操作手冊.md) | 一般使用者 | 畫面配置、四種模式操作步驟、動畫影片下載、FAQ |

## 30 秒快速理解本專案

1. **是什麼**：fork 自 Esri 開源專案 [imagery-explorer-apps](https://github.com/Esri/imagery-explorer-apps)，為分署客製三個影像瀏覽站台 — **DMC III 航攝影像**、**福衛八號**、**Sentinel-2（iframe 包裝）**。
2. **技術棧**：React 19 + Redux Toolkit + ArcGIS Maps SDK (@arcgis/core) + TypeScript + Webpack，部署於 GitHub Pages。
3. **分署客製核心**（相對上游的差異）：
   - `src/dmc-explorer/`、`src/fs8-explorer/` 兩個新應用
   - 多場景鑲嵌顯示（EXPLORE / SWIPE / ANIMATE 均顯示中心點所有重疊影像）
   - 瀏覽器端 MP4 動畫下載（取代 Esri 私有編碼服務）
   - 分署頁首（`src/shared/components/AgencyHeader/`）與站台切換
   - 隱藏 ANALYZE 分析模式（服務無多波段）
4. **上游遺留**：`src/landsat-explorer/` 等 8 個目錄為上游應用，分署不部署、不維護（詳見架構手冊第 15 節冗餘模組清單）。

## 開發快速上手

```bash
# 環境需求：Node.js 20+
npm ci

npm run start:dmc                # https://localhost:8080（HTTPS 自簽憑證）
npm run start:fs8                # https://localhost:8081
npm run start:sentinel2-wrapper  # http://localhost:8082/sentinel2-local.html

npm run lint && npm test         # 提交前檢查
```

部署：push 到 `main` 分支即觸發 GitHub Actions 自動建置部署（`.github/workflows/deploy.yml`）。

## 修改前必讀

- 服務 URL 與 App ID 一律走 `.env`（本機）／GitHub Secrets（CI），**禁止硬編碼**。
- 多場景 objectIds 過濾邏輯分佈在 3 個檔案（`DMCLayer`、`DMCSwipeComponent`、`useDMCMediaLayerImageElement`），修改須同步。
- Sentinel-2 頁首 HTML 存在**兩份**：`deploy.yml`（正式）與 `sentinel2-local.html`（本機），修改須同步。
- 刪除任何上游目錄前，先全域搜尋 `src/shared/` 的 import 引用。
