import path from "path";

export function getFontPath(fontName: string) {
  return path.resolve("assets", "fonts", `${fontName}.ttf`);
}
export function getImagePath(image: string, ext: "png" | "jpeg") {
  return path.resolve("assets", `${image}.${ext}`);
}
