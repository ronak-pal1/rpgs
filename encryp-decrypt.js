import crypto from "node:crypto";

const algorithm = "aes-256-cbc";
const iv = Buffer.alloc(16, 0);

export const encrypt = (text, pass) => {
  const key = crypto.scryptSync(pass, "salt", 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted = cipher.final("hex");

  return encrypted;
};

export const decrypt = (encrypt_text, pass) => {
  const key = crypto.scryptSync(pass, "salt", 32);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypt_text, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
