import { UserDocument } from "@/db/base/UserDocument";
import { model, Schema } from "mongoose";

export interface UserSettingsDocument extends UserDocument {
  autoAccept: boolean;
  autoDecline: boolean;
}

// Индивидуальные настройки пользователя
export const UserSettingsSchema = new Schema<UserSettingsDocument>({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  autoAccept: {
    type: Boolean,
    default: true,
  },
  autoDecline: {
    type: Boolean,
    default: true,
  },
});

// Индивидуальные настройки пользователя
export const UserSettingsModel = model<UserSettingsDocument>(
  "economy_users_settings",
  UserSettingsSchema
);
