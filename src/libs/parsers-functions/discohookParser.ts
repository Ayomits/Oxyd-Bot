  export async function discohookParser(url: string) {
  try {
    const response = await fetch(url);
    const endUrl = response.url;

    let base;

    if (endUrl.includes("https://discohook.org/?data=")) {
      base = endUrl.replace("https://discohook.org/?data=", "");
    } else if (endUrl.includes("https://share.discohook.app/go/")) {
      const jsonResponse = await response.json();
      base = jsonResponse.data;
    }

    if (base) {
      const decoded = Buffer.from(base, "base64").toString("utf-8");
      const json = JSON.parse(decoded);
      return json;
    }
    return null;
  } catch {
    return null;
  }
}

export async function dischookDeParses(data: any): Promise<string> {
  const Base64 = JSON.stringify(data);
  function toBtoa(e) {
    return (function (e) {
      var t = encodeURIComponent(e).replace(/%[\dA-F]{2}/g, function (e) {
        return String.fromCharCode(Number.parseInt(e.slice(1), 16));
      });
      return btoa(t);
    })(e)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  const response = await fetch("https://share.discohook.app/create", {
    method: "post",
    headers: { "content-type": "application/json" },
    body: '{"url":"https://discohook.org/?data=' + toBtoa(Base64) + '"}',
  });

  const json = await response.json();
  return json.url;
}
