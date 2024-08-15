import {
  createCanvas,
  GlobalFonts,
  loadImage,
  SKRSContext2D,
} from "@napi-rs/canvas";
import {
  CanvasKeyValueType,
  CanvasOptionsMetaDataType,
  CanvasOptionsType,
  FontsType,
} from "./CanvasTypes";
import Logger from "../system/Logger";

export class CanvasService {
  private imageCache: Map<string, any>;

  constructor() {
    this.imageCache = new Map();
  }

  async generate(options: CanvasOptionsType) {
    const canvas = createCanvas(options.width, options.height);
    const ctx = canvas.getContext("2d");
    const ctx2 = canvas.getContext("2d");
    const ctx3 = canvas.getContext("2d");
    ctx.textAlign = "center";
    this.registerFonts(options.requiredFonts);
    
    await Promise.all([
      this.setupContext(ctx, options),
      await this.loadAndDrawBackground(ctx2, options.background),
      await this.processElements(ctx3, options.elements),
    ]);
    Logger.success(`Image successfully generated`);
    return canvas.toBuffer("image/png");
  }
  private registerFonts(requiredFonts: FontsType[]) {
    requiredFonts.map((font) => {
      try {
        GlobalFonts.registerFromPath(font.path, font.fontName);
      } catch (error) {
        Logger.error(
          `Failed to register font: ${font.fontName} from ${font.path}`,
          error
        );
      }
    });
  }

  private async loadAndDrawBackground(
    ctx: SKRSContext2D,
    backgroundPath: string
  ) {
    try {
      const backgroundImage = await this.loadImageWithCache(backgroundPath);
      ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    } catch (error) {
      Logger.error(
        `Failed to load background image from ${backgroundPath}`,
        error
      );
      throw error;
    }
  }

  private setupContext(ctx: SKRSContext2D, options: CanvasOptionsType) {
    ctx.font = options.globalFont;
    ctx.fillStyle = options.globalColor;
    ctx.save();
  }

  private async processElements(
    ctx: SKRSContext2D,
    elements: CanvasKeyValueType[]
  ) {
    for await (const element of elements) {
      await this.processElement(ctx, element);
    }
  }

  private async processElement(
    ctx: SKRSContext2D,
    element: CanvasKeyValueType
  ) {
    const promises = Object.entries(element).map(async ([key, data]) => {
      if (key.includes("avatar")) {
        await this.processAvatar(ctx, data);
      } else if (key.includes("text")) {
        await this.processText(ctx, data);
      } else if (key.includes("progress")) {
        this.processProgressBar(ctx, data);
      }
    });
    await Promise.all(promises);
  }

  private async processAvatar(
    ctx: SKRSContext2D,
    data: CanvasOptionsMetaDataType
  ) {
    if (!data.image) return;

    try {
      const image = await this.loadImageWithCache(data.image.url);
      if (data.image.isRounded) {
        this.roundImage(
          data.x,
          data.y,
          data.image.width,
          data.image.height,
          image,
          ctx
        );
      } else {
        ctx.drawImage(
          image,
          data.x,
          data.y,
          data.image.width,
          data.image.height
        );
      }
    } catch (error) {
      Logger.error(`Failed to load avatar image from ${data.image.url}`, error);
      throw error;
    }
  }

  private async processText(
    ctx: SKRSContext2D,
    data: CanvasOptionsMetaDataType
  ) {
    if (!data.text) return;

    ctx.save();

    if (data.text.font) {
      ctx.font = data.text.font;
    }
    if (data.text.color) {
      ctx.fillStyle = data.text.color;
    }

    if (data.text.gradient) {
      const gradient = data.text.gradient;
      const linearGradient = ctx.createLinearGradient(
        gradient.x0,
        gradient.y0,
        gradient.x1,
        gradient.y1
      );
      gradient.colorStops.forEach((colorStop) => {
        linearGradient.addColorStop(colorStop.offset, colorStop.color);
      });
      ctx.fillStyle = linearGradient;
    }
    ctx.fillText(data.text.value, data.x, data.y);

    ctx.restore();
  }

  private processProgressBar(
    ctx: SKRSContext2D,
    data: CanvasOptionsMetaDataType
  ) {
    if (!data.progressBar) return;
    ctx.fillStyle = data.progressBar.color;
    ctx.fillRect(
      data.x,
      data.y,
      data.progressBar.width,
      data.progressBar.height
    );
    ctx.arcTo(
      data.x,
      data.y + data.progressBar.height - 50,
      50,
      Math.PI * 2,
      Math.PI
    );
  }

  private roundImage(
    x: number,
    y: number,
    width: number,
    height: number,
    avatar: any,
    ctx: SKRSContext2D
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, height / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x, y, width, height);
    ctx.restore();
  }

  private async loadImageWithCache(url: string) {
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url);
    }
    const image = await loadImage(url);
    this.imageCache.set(url, image);
    return image;
  }
}

export const CanvasServiceInstance = new CanvasService();
