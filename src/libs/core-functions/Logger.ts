import Colors from "colors";
import moment from "moment";
import { inspect } from "util";

export default class Logger {
  private static universalLog(type: string, ...content: any): void {
    console.log(
      `${type}` +
      " " +
      `${moment(new Date().getTime()).format(`D MMM YYYY kk:mm:ss`)}` +  // Исправлено здесь
      " " +
      `${Colors.white(
        content.map((c) => (typeof c === "string" ? c : inspect(c))).join(" ")
      )}`
    );
  }

  public static log(...content: any) {
    this.universalLog(Colors.bgBlue(" INFO ").black, ...content);
  }

  public static error(...content: any) {
    this.universalLog(Colors.bgRed(" FAIL ").black, ...content);
  }

  public static warn(...content: any) {
    this.universalLog(Colors.bgYellow(" WARN ").black, ...content);
  }

  public static success(...content: any) {
    this.universalLog(Colors.bgGreen(" DONE ").black, ...content);
  }

  public static critical(...content: any) {
    this.universalLog(Colors.bgRed(" CRIT ").black, ...content);
  }
}
