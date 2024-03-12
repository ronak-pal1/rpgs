import { decrypt } from "./encryp-decrypt.js";
import ReadLines from "n-readlines";

const getRandom = (min, max) => {
  // here min is included and max is excluded
  return Math.floor(Math.random() * (max - min) + min);
};

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

export const isLabelExists = (encrypt_text) => {
  const readLines = new ReadLines("./.labels.txt");

  let line;

  while ((line = readLines.next())) {
    if (line.toString("ascii") === encrypt_text) {
      return true;
    }
  }

  return false;
};

export const listLabels = (pass) => {
  const labels = [];
  const readLines = new ReadLines("./.labels.txt");

  let line;
  let keyId = 0;

  while ((line = readLines.next())) {
    const decryptedLabel = decrypt(line.toString("ascii"), pass);
    labels.push({
      key: String.fromCharCode(keyId + 97),
      value: decryptedLabel,
    });
    keyId++;
  }

  return labels;
};

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
