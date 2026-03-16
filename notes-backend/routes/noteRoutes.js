import express from 'express';
import Note from '../models/noteModel.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import client from "../utils/openaiClient.js";
import { defaultMarkdownNote } from "../utils/defaultNote.js";

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

router.post("/", authMiddleware, async (req,res)=>{
    const {title,content} = req.body;
    try{
        const note = await Note.create({
            title,
            content,
            user: req.user.id
        });

        res.json(note);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get("/", authMiddleware, async (req,res) => {
    try{
        let notes = await Note.find({user: req.user.id}).sort({ createdAt: -1 });;
        if (notes.length === 0) {
            const defaultNote = await Note.create({
                user: req.user.id,
                title: defaultMarkdownNote.title,
                content: defaultMarkdownNote.content
            });

            notes = [defaultNote];
            }
        res.json(notes);
    }
    catch (err){
        res.status(500).json({message: err.message});
    }    
})

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

router.put("/:id", authMiddleware, async (req,res)=>{
    try{
        const note = await Note.findOneAndUpdate(
            { _id:req.params.id, user:req.user.id },
            req.body,
            {returnDocument: "after"});

        res.json(note);
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
});

export default router;