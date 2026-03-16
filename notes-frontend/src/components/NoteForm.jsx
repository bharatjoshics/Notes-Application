import { useState, useEffect } from "react";

function NoteForm({ onSubmit, editingNote }) {

 const [title,setTitle] = useState("");
 const [content,setContent] = useState("");

 useEffect(()=>{
  if(editingNote){
   setTitle(editingNote.title);
   setContent(editingNote.content);
  }
 },[editingNote]);

 const handleSubmit = (e)=>{
  e.preventDefault();

  onSubmit({
   title,
   content
  });

  setTitle("");
  setContent("");
 };

 return(

    <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
    >

        <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        className="w-full border rounded-md p-2 mb-4 
        bg-white text-gray-800
        dark:bg-gray-700 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
        rows="4"
        placeholder="Content"
        value={content}
        onChange={(e)=>setContent(e.target.value)}
        className="w-full border rounded-md p-2 mb-4 
        bg-white text-gray-800
        dark:bg-gray-700 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
        {editingNote ? "Update Note" : "Add Note"}
        </button>

    </form>

 );
}

export default NoteForm;