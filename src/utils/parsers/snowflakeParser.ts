// Parse any snowflake values
// Such as role, user, channel etc.

class SnowflakeParser {
  static parseAll(options: { content: string; parseMentions: boolean }) {
    const regex = options.parseMentions
      ? /<(@|#|@&)(\d{17,19})?>/g
      : /(\d{17,19})/g;
    const find = options.content.match(regex);
    return find;
  }

  static user(content: string) {
    return this.baseParser(/<(@)(\d{17,19})/g, content);
  }

  static role(content: string) {
    return this.baseParser(/<(@&)(\d{17,19})/g, content);
  }

  static channel(content: string) {
    return this.baseParser(/<(#)(\d{17,19})/g, content);
  }

  private static baseParser(regex: RegExp, content: string, isZero = false) {
    const find = content.split(regex);
    return find?.length <= 0 && !isZero
      ? this.baseParser(/(\d{17,19})/g, content, true)
      : find;
  }
}

export default SnowflakeParser;
