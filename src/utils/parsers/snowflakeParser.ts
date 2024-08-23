class SnowflakeParser {
  static parseAll(options: { content: string; parseMentions: boolean }) {
    const regex = options.parseMentions
      ? /<(@|#|@&)(\d{17,19})>/g
      : /\b(\d{17,19})\b/g;
    const find = [...options.content.matchAll(regex)];
    return find.map((match) => match[2] || match[1]);
  }

  static user(content: string) {
    return this.baseParser(/<@(\d{17,19})>/g, content);
  }

  static role(content: string) {
    return this.baseParser(/<@&(\d{17,19})>/g, content);
  }

  static channel(content: string) {
    return this.baseParser(/<#(\d{17,19})>/g, content);
  }

  private static baseParser(regex: RegExp, content: string, isZero = false) {
    const find = [...content.matchAll(regex)];
    return find.length <= 0 && !isZero
      ? this.baseParser(/(\d{17,19})/g, content, true)
      : find.map((match) => match[1]);
  }
}

export default SnowflakeParser;
