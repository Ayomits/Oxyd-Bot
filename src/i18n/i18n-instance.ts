import { I18n } from "./i18n";

const i18n = new I18n({
  pattern: `${global.rootDir}/i18n/**/*.json`,
  currentLanguage: `ru`,
});

export default i18n;