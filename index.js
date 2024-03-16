#!/usr/bin/env node

import { program } from "commander";
import {
  addLabel,
  colorText,
  generate,
  isLabelExists,
  listLabels,
  removeLabel,
} from "./utility.js";
import clipboardy from "clipboardy";
import inquirer from "inquirer";
import Conf from "conf";
import bcrypt from "bcrypt";
import { encrypt, decrypt } from "./encryp-decrypt.js";
const config = new Conf({ projectName: "rpgs" });

program.version("1.1.0", "-v, --version", "Display the version");

const isInitialized = () => {
  if (!config.get("username")) {
    console.log(
      colorText("\n Please first initialize the password manager\n", 31)
    );

    console.log(
      colorText("Use the command below to initialize the manager\n", 35)
    );
    console.log(colorText("\trpgs init\n", 37));

    return false;
  }

  return true;
};

const isAdmin = async () => {
  const value = await inquirer
    .prompt([
      {
        name: "managerUser",
        message: "Enter the username of your manager",
      },
      {
        name: "managerPass",
        message: "And enter the secret key of your manager",
        type: "password",
      },
    ])
    .then(async (credentials) => {
      if (
        (await bcrypt.compare(
          credentials.managerUser,
          config.get("username")
        )) == false
      ) {
        console.log(colorText("\nYour manager username is incorrect\n", 31));
        return { result: false };
      }

      if (
        (await bcrypt.compare(
          credentials.managerPass,
          config.get("password")
        )) == false
      ) {
        console.log(colorText("\nYour manager password is incorrect\n", 31));
        return { result: false };
      }

      return { result: true, pass: credentials.managerPass };
    });

  return value;
};

// The below command is use to generate a random password
program
  .command("generate")
  .description("To generate a strong random password")
  .option("-c,--copy", "To copy the generated password")
  .action(async (options) => {
    const password = generate();
    console.log(
      `\n${colorText("Your new generated password is", 32)} ${password}`
    );
    console.log(
      colorText(
        "\n\nCaution:\nDon't share this password with anyone else.\nSave this password in rpgs password manager for safety and better experience!\n",
        33
      )
    );

    console.log(colorText("Use the command below to save your password\n", 35));
    console.log(colorText("\trpgs save\n", 37));

    if (options.copy) {
      await clipboardy.write(password);
    }
  });

program
  .command("save")
  .description("To save your password with a label in the manager")
  .action(() => {
    if (!isInitialized()) return;

    inquirer
      .prompt([
        {
          name: "label",
          message: "Give a label to your password",
        },
        {
          name: "password",
          message: "Enter the password to save in manager",
          type: "password",
        },
      ])
      .then(async (answers) => {
        const adminCheck = await isAdmin();
        if (!adminCheck.result) return;

        const encryptedLabel = encrypt(answers.label, adminCheck.pass);

        if (isLabelExists(config, encryptedLabel)) {
          console.log(
            colorText(
              "\nThe label already exits. Please use a different label to store the password\n",
              31
            )
          );
          return;
        }

        const encryptedPass = encrypt(answers.password, adminCheck.pass);

        addLabel(config, encryptedLabel);

        config.set(encryptedLabel, encryptedPass);

        console.log(colorText("\nYour password is successfully saved\n", 32));
      });
  });

program
  .command("show")
  .description("To show the labels of stored passwords to select from")
  .option("-p,--print", "To print the password in the terminal")
  .action(async (options) => {
    if (!isInitialized()) return;

    const adminCheck = await isAdmin();
    if (!adminCheck.result) return;

    inquirer
      .prompt([
        {
          type: "expand",
          name: "label",
          message: "Choose the label which you want to copy",
          choices: listLabels(config, adminCheck.pass),
        },
      ])
      .then(async (answers) => {
        const encrypted_pass = config.get(
          encrypt(answers.label, adminCheck.pass)
        );

        const pass = decrypt(encrypted_pass, adminCheck.pass);
        await clipboardy.write(pass);

        console.log(
          colorText("\nYour password is successfully copied!!!\n", 32)
        );

        if (options.print) {
          console.log(
            colorText(
              `\nThe password of your ${answers.label} account is : ${pass}\n`,
              37
            )
          );
        } else {
          console.log(
            colorText(
              "\nTo view the password, use the -p or --print flag with the command\n",
              33
            )
          );
        }
      });
  });

program
  .command("reset")
  .description(
    "To reset the whole password manager. (It will delete all the passwords)"
  )
  .action(() => {
    if (!isInitialized()) return;

    inquirer
      .prompt([
        {
          name: "decision",
          message:
            "Do you want to reset your manager (It will delete all your stored password)? (y/n) ",
        },
      ])
      .then(async (answers) => {
        if (answers.decision === "n" || answers.decision === "N") return;
        else if (answers.decision === "y" || answers.decision === "Y") {
          const adminCheck = await isAdmin();
          if (!adminCheck.result) return;

          config.clear();

          console.log(
            colorText("\nYou successfully reseted your password manager\n", 32)
          );
        } else {
          console.log(
            colorText(
              "\nYou entered a wrong character. It is either y (yes) or n (no)\n",
              31
            )
          );
        }
      });
  });

program
  .command("delete")
  .description("To delete a password from the password manager")
  .action(async () => {
    if (!isInitialized()) return;

    const adminCheck = await isAdmin();
    if (!adminCheck.result) return;

    inquirer
      .prompt([
        {
          type: "expand",
          name: "label",
          message: "Choose the label which you want to delete",
          choices: listLabels(config, adminCheck.pass),
        },
      ])
      .then((labelChoice) => {
        inquirer
          .prompt([
            {
              name: "decision",
              message: `Do you want to delete the password of ${labelChoice.label}? (y/n) `,
            },
          ])
          .then((answers) => {
            if (answers.decision === "n" || answers.decision === "N") return;
            else if (answers.decision === "y" || answers.decision === "Y") {
              const encrypted_label = encrypt(
                labelChoice.label,
                adminCheck.pass
              );

              removeLabel(config, encrypted_label);
              config.delete(encrypted_label);

              console.log(
                colorText(
                  `\nPassword of ${labelChoice.label} is successfully deleted\n`,
                  32
                )
              );
            } else {
              console.log(
                colorText(
                  "\nYou entered a wrong character. It is either y (yes) or n (no)\n",
                  31
                )
              );
            }
          });
      });
  });

program
  .command("init")
  .description("To initialize rpgs password manager")
  .action(() => {
    if (config.get("username")) {
      console.log(colorText("\n You already initialized your manager\n", 32));
      return;
    }

    inquirer
      .prompt([
        {
          name: "username",
          message: "Give a username to your password manager",
        },
        {
          name: "password",
          message: "Enter a secret key for your password manager",
          type: "password",
        },
      ])
      .then(async (answers) => {
        const hashUser = await bcrypt.hash(answers.username, 10);
        const hashPass = await bcrypt.hash(answers.password, 10);

        config.set("username", hashUser);
        config.set("password", hashPass);
      });
  });

// program.addHelpText(
//   "before",
//   `\nHere is the list of commands that you can use:\n`
// );
program.parse();
