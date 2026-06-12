const crypto = require("crypto");

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(String(process.env.CHAT_ENCRYPTION_KEY || "default_secret_key_placeholder"))
  .digest(); //32 bytes for AES-256

 const IV_LENGTH=16; //AES BLOCK

function encrypt(text){
    if (!text) return "";
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    // Use the pre-hashed ENCRYPTION_KEY (already a Buffer)
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
  } catch (err) {
    console.error("Encryption Error:", err.message);
    return text;
  }
}

function decrypt(text){
    if (!text || !text.includes(":")) return text;
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "base64");
    const encryptedText = textParts.join(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    // If decryption fails (e.g. old messages with a different key), return raw text
    console.error("Decryption Error:", err.message);
    return text;
  }
}

module.exports={encrypt,decrypt};