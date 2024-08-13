import { Document, model, Schema } from "mongoose";

export interface ClansDocument extends Document {}
export const ClansSchema = new Schema<ClansDocument>({});
export const ClansModel = model<ClansDocument>(`economy_clans`, ClansSchema);
