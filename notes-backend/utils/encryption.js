import crypto from "crypto";

const algorithm = "aes-256-cbc";

// MUST be 32 bytes
const secretKey = process.env.ENCRYPTION_KEY;

// IV = random (16 bytes)
export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(hash.iv, "hex")
  );

  let decrypted = decipher.update(hash.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const safeDecrypt = (field) => {
    try{
        if (typeof field === "string")
            return field;

        if (field?.iv && field?.content)
            return decrypt(field);

        return "";
    } catch(err){
        console.error("Decryption error: ",err);
        return "";
    }
};