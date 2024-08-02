export type I18nOptions = {
  pattern: string
  currentLanguage: string
}

export type Translations = {[key: string]: string | Translations}