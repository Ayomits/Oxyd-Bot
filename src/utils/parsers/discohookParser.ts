export async function discohookParser(url: string) {
  const response = await fetch(url);
  const endUrl = response.url;
  const base = endUrl.replace("https://discohook.org/?data=", "");
  const decoded = Buffer.from(base, "base64").toString("utf-8");

  const json = JSON.parse(decoded)
  return json
}
