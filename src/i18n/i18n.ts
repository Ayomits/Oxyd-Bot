import { glob } from "glob";
import { I18nOptions, Translations } from "./i18n-types";
import * as path from "path";

export class I18n {
  public options: I18nOptions;
  public translates: { [key: string]: Translations } = {};
  public isInitialized: boolean = false;
  public initPromise: Promise<void>;

  constructor(options: I18nOptions) {
    this.options = options;
    this.initPromise = this.collectLanguages().then(() => {
      this.isInitialized = true;
    });
  }

  private async collectLanguages() {
    const files = await glob(this.options.pattern);
    for (const file of files) {
      try {
        const language = await import(path.resolve(file));
        const languageName = path.basename(file).slice(0, -5);
        this.translates[languageName] = language;
      } catch (err) {
        throw err;
      }
    }
  }

  public async init() {
    await this.initPromise;
    return this;
  }

  public changeLanguage(newLanguage: string) {
    this.options.currentLanguage = newLanguage;
    return this;
  }

  public translate(key: string, language: string) {
    const translate = this.translates?.[language.toLowerCase()];
    const splitedKey = key.split(".");
    const value = this.getValueByBigKey(splitedKey, translate);
    return value;
  }

  private getValueByBigKey(keys: string[], object: Translations) {
    return keys.reduce((acc, key) => acc?.[key], object);
  }
}