# 前驅期巴金森病研究計算器 · 繁體中文

依 **2019 MDS 前驅期巴金森病研究準則**公開論文獨立實作。非 MDS 官方翻譯、官方網站複本或經臨床驗證的醫療器材。

網頁：<https://a7662888.github.io/prodromal-pd-calculator-zh-TW/>

- 純瀏覽器計算，健康輸入不上傳、不儲存；無分析追蹤或第三方字型。
- 年齡先驗機率、完整 LR 明細、來源表與繁中判定條件。
- 未評估不當陰性；RBD／OH／家族與遺傳各採單一路徑；兩項動作評估依原準則合併。
- 研究分類採精確貝氏計算，判定後驗機率 ≥80% 且前驅標記合併 LR ≥4。
- 不適用未滿 50 歲、已達臨床 PD 診斷或特定高外顯率單基因變異者。
- 結果是目前前驅狀態的機率估計，**不是特定期間內的發病率**。需由神經科／動作障礙專業人員依原準則判讀。

## 本機使用

需要 HTTP server 以載入 JavaScript modules；直接雙擊 `index.html` 可能被瀏覽器阻擋。

```powershell
python -m http.server 8791 --bind 127.0.0.1
```

開啟 <http://127.0.0.1:8791/>。無建置步驟、無 npm 相依套件。

```powershell
node --test tests/*.test.js
```

## 維護與發布

GitHub Pages 以 `main` 的 `/docs` 發布；`docs` 只含明確列出的公開靜態資產，避免公開開發報告。原始檔在根目錄，執行 `node scripts/build.mjs` 同步到 `docs` 後再提交。CI 驗證運算測試與 `docs` 一致性。

主要檔案：`data.js`（文獻數值）、`calculator.js`（純計算）、`app.js`（互動）、`index.html`／`styles.css`（介面）。醫學依據及設計決定見 [SOURCES.md](SOURCES.md)，資安邊界見 [SECURITY.md](SECURITY.md)，驗收證據見 [QA.md](QA.md)。

## 來源與授權

Heinzel S, et al. Movement Disorders. 2019;34:1464–1470. [doi:10.1002/mds.27802](https://doi.org/10.1002/mds.27802)，公開論文採 Creative Commons Attribution 授權。另引用 Berg D, et al. 2015，[doi:10.1002/mds.26431](https://doi.org/10.1002/mds.26431) 的方法學。

此專案重新撰寫介面、翻譯與計算程式；未複製會員版原始碼、MDS 商標或量表題目。參數與改作說明保留原始論文出處，詳見 [SOURCES.md](SOURCES.md)。本 repository 未另授予軟體授權；對第三方公開論文的適用授權不作變更。
