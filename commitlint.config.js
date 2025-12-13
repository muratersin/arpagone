const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // Yeni özellik
        "fix", // Hata düzeltmesi
        "docs", // Dokümantasyon
        "style", // Kod stili (boşluk, noktalama vb.)
        "refactor", // Kod yeniden düzenleme
        "perf", // Performans iyileştirmesi
        "test", // Test ekleme/düzeltme
        "chore", // İnşaat aracı, bağımlılıkları güncelleme
        "ci", // CI konfigürasyonu değişiklikleri
        "revert", // Commit geri alma
      ],
    ],
    "type-case": [2, "always", "lowercase"],
    "type-empty": [2, "never"],
    "scope-case": [2, "always", "lowercase"],
    "subject-empty": [2, "never"],
    "subject-case": [2, "never", "uppercase"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72],
  },
};

export default commitlintConfig;
