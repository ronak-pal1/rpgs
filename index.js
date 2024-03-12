#!/usr/bin/env node

import { program } from "commander";
import { colorText, generate, isLabelExists, listLabels } from "./utility.js";
import clipboardy from "clipboardy";
import inquirer from "inquirer";
import Conf from "conf";
import bcrypt from "bcrypt";
import fs from "fs";
import { encrypt, decrypt } from "./encryp-decrypt.js";

const config = new Conf({ projectName: "rpgs" });

fs.writeFileSync("./.labels.txt", "", { flag: "a+" });

program.version("1.0.0", "-v, --version", "Display the version");

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
    if (!config.get("username")) {
      console.log(
        colorText("\n Please first initialize the password manager\n", 31)
      );

      console.log(
        colorText("Use the command below to initialize the manager\n", 35)
      );
      console.log(colorText("\trpgs init\n", 37));
      return;
    }

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
        {
          name: "managerUser",
          message: "Now enter the username of your manager",
        },
        {
          name: "managerPass",
          message: "And enter the secret key of your manager",
          type: "password",
        },
      ])
      .then(async (answers) => {
        if (
          (await bcrypt.compare(answers.managerUser, config.get("username"))) ==
          false
        ) {
          console.log(colorText("\nYour manager username is incorrect\n", 31));
          return;
        }

        if (
          (await bcrypt.compare(answers.managerPass, config.get("password"))) ==
          false
        ) {
          console.log(colorText("\nYour manager password is incorrect\n", 31));
          return;
        }

        const encryptedLabel = encrypt(answers.label, answers.managerPass);

        if (isLabelExists(encryptedLabel)) {
          console.log(
            colorText(
              "\nThe label already exits. Please use a different label to store the password\n",
              31
            )
          );
          return;
        }

        const encryptedPass = encrypt(answers.password, answers.managerPass);

        fs.writeFileSync("./.labels.txt", `${encryptedLabel}\n`, {
          flag: "a+",
        });

        config.set(encryptedLabel, encryptedPass);
      });
  });

program
  .command("show")
  .description("To show the labels of stored passwords to select from")
  .option("-p,--print", "To print the password in the terminal")
  .action((options) => {
    if (!config.get("username")) {
      console.log(
        colorText("\n Please first initialize the password manager\n", 31)
      );

      console.log(
        colorText("Use the command below to initialize the manager\n", 35)
      );
      console.log(colorText("\trpgs init\n", 37));
      return;
    }

    inquirer
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
          return;
        }

        if (
          (await bcrypt.compare(
            credentials.managerPass,
            config.get("password")
          )) == false
        ) {
          console.log(colorText("\nYour manager password is incorrect\n", 31));
          return;
        }

        inquirer
          .prompt([
            {
              type: "expand",
              name: "label",
              message: "Choose the label which you want to copy",
              choices: listLabels(credentials.managerPass),
            },
          ])
          .then(async (answers) => {
            const encrypted_pass = config.get(
              encrypt(answers.label, credentials.managerPass)
            );

            const pass = decrypt(encrypted_pass, credentials.managerPass);
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

program.addHelpText("after", `this is a help doc`);
program.parse();
