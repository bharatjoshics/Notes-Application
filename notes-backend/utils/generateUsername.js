export const generateUsername = async (email) => {
  const base = email.split("@")[0]; // before @
  let username = base;
  let count = 1;

  while (await User.findOne({ username })) {
    username = `${base}${count}`;
    count++;
  }

  return username;
};