import mongoose from "mongoose";

const encryptedFieldSchema = new mongoose.Schema({
  iv: String,
  content: String
}, {_id: false});

const noteSchema = new mongoose.Schema({
  title: {
    type: encryptedFieldSchema,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
{
  timestamps: true
});

export default mongoose.model("Note", noteSchema);