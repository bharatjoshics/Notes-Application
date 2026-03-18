const encoder = new TextEncoder();
const decoder = new TextDecoder();

let cachedKey = null;

// 🔑 derive key from passphrase
export const generateKey = async (passphrase) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("notes-app-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
};

const getPassphrase = () => {
  try{
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.passphrase || null;
  } catch(err){
    return null;
  }
};

export const getKey = async () => {
  if (cachedKey) return cachedKey;

  const passphrase = getPassphrase();

  if(!passphrase){
    throw new Error("No Passphrase found");
  }

  cachedKey = await generateKey(passphrase);
  return cachedKey;
};

// 🔒 encrypt content
export const encryptContent = async (text, key) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );

  return {
    iv: Array.from(iv),
    content: Array.from(new Uint8Array(encrypted)),
  };
};

// 🔓 decrypt content
export const decryptContent = async (data, key) => {
  try {
    if (!data || typeof data === "string") return data;
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(data.iv),
      },
      key,
      new Uint8Array(data.content)
    );

    return decoder.decode(decrypted);
  } catch (err) {
    console.error("E2EE Decryption failed", err);
    return "[Unable to decrypt]";
  }
};