import User from "../models/User.js";

export const generateUsername = async (email) => {
  const base = email.split("@")[0]; // before @
  let username = base;

  while (await User.findOne({ username })) {
    username = `${base}${Math.floor(Math.random()*10000)}`;
  }

  return username;
};