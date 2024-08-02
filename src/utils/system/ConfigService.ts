import { config, type DotenvParseOutput } from "dotenv";

class ConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      throw new Error(`File .env not found`);
    }
    if (!parsed) {
      throw new Error(`File .env is empty`);
    }
    this.config = parsed;
  }

  get(key: string): string | never {
    const res = this.config[key];
    if (!res) {
      throw new Error(`This key does not exists`);
    }
    return res;
  }
}
const configService = new ConfigService();
export default configService;
