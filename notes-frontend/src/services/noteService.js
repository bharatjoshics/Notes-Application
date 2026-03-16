import axiosClient from "../api/axiosClient";

export const getNotes = async () => {
  const res = await axiosClient.get("/notes");
  return res.data;
};

export const createNote = async (note) => {
  const res = await axiosClient.post("/notes", note);
  return res.data;
};

export const updateNote = async (id, note) => {
  const res = await axiosClient.put(`/notes/${id}`, note);
  return res.data;
};

export const deleteNote = async (id) => {
  await axiosClient.delete(`/notes/${id}`);
};

export const summarizeNote = async (content) => {
  const res = await axiosClient.post("/notes/summarize", {
    content
  });

  return res.data.summary;
};