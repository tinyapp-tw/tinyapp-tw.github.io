# TinyApp 工具箱（首頁）

`https://tinyapp-tw.github.io/` 的門面頁：列出所有小工具、提供開啟連結與 iPhone 安裝教學。

## 定位

- **目錄 + 安裝入口**，不是日常使用入口——各工具請個別「加入主畫面」，從各自的圖示開啟（iOS 對每個主畫面 App 的資料是隔離的，混用入口會造成資料分裂）
- 純靜態頁面，不需要 Service Worker、不需要安裝

## 新增工具時

1. 在 `index.html` 的 `.grid` 裡照現有格式加一張 `.tool` 卡（圖示直接引用 `/<repo>/icons/icon-192.png`，與該工具自動同步）
2. commit + push 即上線

## 本機測試

```bash
python serve.py 8125
```

注意：本機測試時工具圖示會 404（`/subman/...` 是站上絕對路徑），部署後正常。

## 部署

Repo 名稱必須完全等於 `tinyapp-tw.github.io`（帳號的 user site）。此類 repo 推上 main 後 GitHub Pages 通常會自動發佈至網域根目錄。
