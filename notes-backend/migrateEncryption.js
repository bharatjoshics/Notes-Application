import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/noteModel.js";
import { encrypt } from "./utils/encryption.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const notes = await Note.find();

    for (let note of notes) {
      let updated = false;

      // 🔥 Check if title is NOT encrypted
      if (typeof note.title === "string") {
        note.title = encrypt(note.title);
        updated = true;
      }

      // 🔥 Check if content is NOT encrypted
      if (typeof note.content === "string") {
        note.content = encrypt(note.content);
        updated = true;
      }

      if (updated) {
        await note.save();
        console.log(`Updated note: ${note._id}`);
      }
    }

    console.log("Migration completed ✅");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();