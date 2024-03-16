import { decrypt } from "./encryp-decrypt.js";

export const colorText = (text, colorId) => {
  // red = 31
  // green = 32
  // yellow = 33
  // blue = 34
  // magenta = 35
  // cyan = 36
  // white = 37
  // reset color = 0
  return `\x1b[${colorId}m${text}\x1b[0m`;
};

export const addLabel = (config, encrypted_label) => {
  const labels = config.get("labels") ? config.get("labels") : [];

  labels.push(encrypted_label);

  config.set("labels", labels);
};

export const removeLabel = (config, encrypted_label) => {
  let labels = config.get("labels");

  labels = labels.filter((label) => label != encrypted_label);

  config.set("labels", labels);
};

export const isLabelExists = (config, encrypted_label) => {
  const labels = config.get("labels");
  if (!labels) {
    return false;
  }

  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === encrypted_label) return true;
  }

  return false;
};

export const listLabels = (config, pass) => {
  const encrypted_labels = config.get("labels");
  if (!encrypted_labels) return [];
  let decrypted_labels = [];

  for (let i = 0; i < encrypted_labels.length; i++) {
    const decryptedLabel = decrypt(encrypted_labels[i], pass);
    decrypted_labels.push({
      key: String.fromCharCode(i + 97),
      value: decryptedLabel,
    });
  }

  return decrypted_labels;
};

// The below function is for generating a random value in the range [min, max)
const getRandom = (min, max) => {
  // here min is included and max is excluded
  return Math.floor(Math.random() * (max - min) + min);
};

// The below function is for generating a random password
export const generate = () => {
  let pass = "";

  for (let i = 1; i <= 14; i++) {
    const random = getRandom(1, 5);

    if (random == 1) {
      pass += getRandom(0, 10);
    } else if (random == 2) {
      pass += String.fromCharCode(getRandom(65, 91));
    } else if (random == 3) {
      pass += String.fromCharCode(getRandom(97, 123));
    } else if (random == 4) {
      pass += String.fromCharCode(getRandom(33, 48));
    }
  }

  return pass;
};
