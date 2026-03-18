import express from 'express';
import Note from '../models/noteModel.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import client from "../utils/openaiClient.js";
import { defaultMarkdownNote, defaultNote } from "../utils/defaultNote.js";
import { encrypt, safeDecrypt } from '../utils/encryption.js';

const router = express.Router();

// AI Summarize
router.post("/summarize", authMiddleware, async (req,res)=>{

 try{

  const {content} = req.body;

  const response = await client.chat.completions.create({
   model: "deepseek/deepseek-chat",
   messages:[
    {
     role:"user",
     content:`Summarize this note in 2-3 sentences:\n\n${content}`
    }
   ]
  });

  const summary = response.choices[0].message.content;

  res.json({summary});

 }catch(err){

  console.error(err);
  res.status(500).json({message:"AI summarization failed"});

 }

});


// Create Note
router.post("/", authMiddleware, async (req,res)=>{
    const title = encrypt(req.body.title);
    const content = req.body.content;
    try{
        const note = await Note.create({
            title,
            content,
            user: req.user.id
        });

        res.json({
            ...note._doc,
            title: safeDecrypt(note.title),
            content: note.content
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});


// Fetch Notes
router.get("/", authMiddleware, async (req,res) => {
    try{
        let notes = await Note.find({user: req.user.id}).sort({ createdAt: -1 });;
        if (notes.length === 0) {
            const defaultNotes = [
        {
          user: req.user.id,
          title: encrypt(defaultMarkdownNote.title),
          content: defaultMarkdownNote.content
        },
        {
          user: req.user.id,
          title: encrypt(defaultNote.title),
          content: defaultNote.content
        }
      ];
      const createdNotes = await Note.insertMany(defaultNotes);
      notes = createdNotes;
    }
        
    const decryptedNotes = notes.map((note)=>({
        ...note._doc,
        title: safeDecrypt(note.title),
        content: note.content
    }));
        
    res.json(decryptedNotes);
    }
    catch (err){
        console.error(err);
        res.status(500).json({message: err.message});
    }    
});


// Delete Note
router.delete("/:id", authMiddleware, async (req,res)=>{
    try{
        await Note.findOneAndDelete({
            _id:req.params.id,
            user:req.user.id
        });
        res.json({message:"Note deleted"});
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
});


// Update Note
router.put("/:id", authMiddleware, async (req,res)=>{
    try{
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title: encrypt(req.body.title),
                content: req.body.content,
            },
            { returnDocument: "after" }
        );

        res.json({
            ...updatedNote._doc,
            title: safeDecrypt(updatedNote.title),
            content: updatedNote.content
        });
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
});

export default router;