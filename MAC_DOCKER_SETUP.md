Mac 上的快速啟動（Docker）

在 Mac 上只需要三步即可啟動整個開發環境：

1. 安裝 Docker Desktop for Mac
   - 從 https://docker.com/ 下載，Apple Silicon 的機器請選「Apple chip」版本。

2. 下載程式碼並把 `.env` 放到專案根目錄

```bash
git clone https://github.com/calpis008/ASRS_imagery-explorer-apps.git
cd ASRS_imagery-explorer-apps
# 將這台電腦的 .env 複製到專案根目錄（用隨身碟等安全方式傳送）
```

3. 一鍵啟動全部服務

```bash
docker compose up
```

- 首次執行會自動建置 image（下載 Node 20 + 安裝依賴，約 5–10 分鐘），之後每次啟動只需等 webpack 編譯 1–2 分鐘。

服務與對應網址

- DMC III: https://localhost:8080/
- 福衛八號: https://localhost:8081/
- Sentinel-2: http://localhost:8082/sentinel2-local.html

為什麼容器化最不容易出錯

- Node 版本不一致 → 容器固定 Node 20，與 CI 完全一致
- npm ci 因作業系統差異裝出不同二進位依賴 → `node_modules` 隔離在容器內，不碰主機檔案
- Mac/Windows 環境設定步驟遺漏 → 只需要 Docker Desktop + `.env`，其他全自動

補充說明

- `.env` 含機密資訊，故未加入 Git，需手動複製到專案根目錄（這是唯一無法自動化的步驟）
- 只想啟動單一服務：`docker compose up dmc`
- 停止服務：按 `Ctrl+C` 或 `docker compose down`
- 修改程式碼不需重建容器：原始碼為掛載模式，webpack 會自動熱更新；只有 `package.json` 變更時才需 `docker compose build` 重建
- Windows 電腦亦可使用相同的 `docker compose up` 啟動，兩邊環境一致

若你要，我可以幫你把 README 加入此檔案的連結。