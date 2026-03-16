import ReactMarkdown from "react-markdown";
import { summarizeNote } from "../services/noteService";
import { useState } from "react";
import { exportNoteToPDF } from "../utils/pdfExport";

const stripMarkdown = (markdown) => {
  const html = marked(markdown);
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText;
};

function NoteItem({ note, onDelete, onEdit }) {

    const [summary, setSummary] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const handleSummarize = async () => {
        setLoadingSummary(true);
        const result = await summarizeNote(note.content);
        setSummary(result);
        setLoadingSummary(false);
    };

    const handleDownloadPDF = () => {
        exportNoteToPDF(note);
    };

 return (
  <div id={`note-${note._id}`}
  className="bg-white/80 dark:bg-gray-800/80 
    backdrop-blur-sm
    shadow-md rounded-xl p-6
    transition-all duration-300
    hover:-translate-y-1 hover:shadow-xl
    border border-gray-200 dark:border-gray-700">

    <h2 className="text-xl font-semibold mb-2">
      {note.title}
    </h2>

    <div className="mb-4 prose max-w-none 
        text-gray-700 
        dark:text-gray-300">

        <div className= "prose dark:prose-invert max-w-none"> 
            <div className={!expanded ? "line-clamp-3" : ""}>
                <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
        </div>

        {!expanded && (
            <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
            >
            View More
            </button>
        )}

        {expanded && (
            <button
            onClick={() => setExpanded(false)}
            className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
            >
            View Less
            </button>
        )}

    </div>

    {/* Buttons Row */}
    <div className="flex gap-3 flex-wrap mt-3">

      <button
        onClick={handleSummarize}
        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
      >
        {loadingSummary ? "Summarizing..." : "Summarize"}
      </button>

      <button
        onClick={() => onDelete(note._id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>

      <button
        onClick={() => onEdit(note)}
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
      >
        Edit
      </button>

      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
       >
        Download PDF
       </button>

    </div>

    {/* Summary Section */}
    {summary && (
      <div className="mt-4 p-3 bg-zinc-900 text-white rounded break-words">
        <strong>Summary:</strong>
        <p className="mt-1">{summary}</p>
      </div>
    )}

  </div>
);
}

export default NoteItem;