import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import NoteForm from "../components/NoteForm";
import { getNotes, createNote, deleteNote, updateNote } from "../services/noteService";
import { useNavigate } from "react-router-dom";
import NoteSkeleton from "../components/NoteSkeleton";
import { exportAllNotesToPDF } from "../utils/pdfExport";
import { getKey, encryptContent, decryptContent } from "../utils/e2eCrypto";

function NotesPage(){

 const [notes,setNotes] = useState([]);
 const [editingNote,setEditingNote] = useState(null);
 const [loading, setLoading] = useState(false);
 const [search, setSearch] = useState("");
 const [darkMode, setDarkMode] = useState(false);
 const [sortOrder, setSortOrder] = useState("newest");
 const navigate = useNavigate();

 const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const user = getUser();

 /* ---------------- THEME DETECTION ---------------- */

 useEffect(() => {

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setDarkMode(savedTheme === "dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }

 }, []);

 useEffect(() => {

  if (darkMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme","dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme","light");
  }

 }, [darkMode]);

 /* ---------------- FETCH NOTES ---------------- */

 const fetchNotes = async () => {
  try {
    const key = await getKey();
    const data = await getNotes();

    const notes = await Promise.all(
      data.map(async (note) => {
        const isEncrypted =
          typeof note.content === "object" &&
          note.content?.iv &&
          note.content?.content;

        const content = isEncrypted
          ? await decryptContent(note.content, key)
          : typeof note.content === "string"
            ? note.content : "";

        return {
          ...note,
          content,        // ✅ ALWAYS STRING
          isEncrypted     // ✅ TRUE/FALSE
        };
      })
    );

    setNotes(notes);
  } catch (err) {
    console.error(err);
  }
};

 useEffect(()=>{
  fetchNotes();
 },[]);

 /* ---------------- CRUD OPERATIONS ---------------- */

 const handleCreate = async (note)=>{
  const key = await getKey();

  const encryptedContent = await encryptContent(note.content, key);

  const newNote = await createNote({
    ...note,
    content: encryptedContent
  });

  const newNoteForUI = {
    ...newNote,
    content: note.content,
    isEncrypted: true
  };
  setNotes((prev)=>[newNoteForUI, ...prev]);
  toast.success("Note created!");
 };

 const handleDelete = async (id)=>{
  setNotes((prev) => prev.filter((note) => note._id !== id));
  try{
      await deleteNote(id);
      toast.success("Note deleted!");
  }
  catch(err){
      fetchNotes();
  }
 };

 const handleEdit = (note)=>{
  setEditingNote(note);
 };

 const handleUpdate = async (note) => {
  const key = await getKey();

  // ALWAYS encrypt before saving
  const encryptedContent = await encryptContent(note.content, key);

  await updateNote(editingNote._id, {
    ...note,
    content: encryptedContent // ✅ OBJECT goes to DB
  });

  const updatedNoteForUI = {
    ...editingNote,
    ...note,
    content: note.content, // ✅ STRING for UI
    isEncrypted: true      // ✅ because now it's encrypted
  };

  setNotes((prev) =>
    prev.map((n) =>
      n._id === editingNote._id ? updatedNoteForUI : n
    )
  );

  setEditingNote(null);
  toast.success("Note updated!");
};

 /* ---------------- SORTING ---------------- */

 const sortedNotes = [...notes].sort((a, b) => {
  if (sortOrder === "newest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }
  return new Date(a.createdAt) - new Date(b.createdAt);
});

 /* ---------------- SEARCH ---------------- */

 const getText = (field) => {
  if(typeof field === "string")
    return field;

  return "";
 };

 const filteredNotes = sortedNotes.filter((note)=>
    getText(note.title).toLowerCase().includes(search.toLowerCase())
);

 /* ---------------- LOGOUT ---------------- */

 const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

 /* ---------------- DOWNLOAD ALL NOTES ---------------- */

const stripMarkdown = (markdown) => {
  const html = marked(markdown);
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText;
};

const handleExportAllNotes = () => {
    exportAllNotesToPDF(notes);
};

 /* ---------------- UI ---------------- */

 return(

  <div className="min-h-screen py-10 px-4 bg-gray-100 dark:bg-gray-900 dark:text-white">

  <div className="max-w-6xl mx-auto">

    <div className="flex justify-between items-center">

      <p className="text-lg font-semibold">
        Welcome {user?.name}
      </p>

      <button onClick={handleLogout}
      className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>

    </div>

   <h1 className="text-4xl font-bold text-center mb-8">
    Vault Notes
   </h1>

    <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-6 px-4 py-2 rounded 
        bg-gray-800 text-white 
        dark:bg-yellow-400 dark:text-black"
        >
        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
    </button>

    <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="ml-2 mb-4 p-2 border rounded bg-white dark:bg-gray-800"
    >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
    </select>

    <button
        onClick={handleExportAllNotes}
        className="mb-6 ml-4 px-4 py-2 rounded 
        bg-green-600 text-white 
        hover:bg-green-700"
        >
        Export All Notes
    </button>

    <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-md p-2 mb-6 
        bg-white text-gray-800 
        dark:bg-gray-800 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

   <NoteForm
    onSubmit={editingNote ? handleUpdate : handleCreate}
    editingNote={editingNote}
   />

    {loading ? (
        <div className="mt-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
            <NoteSkeleton key={i} />
            ))}
        </div>
    ) : notes.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">No notes yet</p>
            <p className="text-sm">Create your first note above</p>
        </div>
    ) : (
        <div className="mt-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note)=>(
            <NoteItem
            key={note._id}
            note={note}
            onDelete={handleDelete}
            onEdit={handleEdit}
        />
    ))}
   </div>
    )}
  </div>
 </div>
 );
}

export default NotesPage;