# rpgs.js

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![Npm package total downloads](https://badgen.net/npm/dt/express)](https://npmjs.com/package/rpgs)

> RPGS (Rapid Password Generator & Storer) is a convenient npm package designed to simplify password management directly from the command line interface (CLI). With RPGS, you can securely store and generate passwords, all without leaving your terminal. Say goodbye to the hassle of navigating between different applications to find or generate passwords.

## Prerequisites

This program requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

## Table of contents

- [rpgs.js](#rpgsjs)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Initializing the password manager](#initializing-the-password-manager)
    - [Generating a random password](#generating-a-random-password)
    - [Saving a password with a label](#saving-a-password-with-a-label)
    - [Getting the passwords](#getting-the-passwords)
    - [Version info](#version-info)
    - [Help](#help)
  - [Contributing](#contributing)
  - [Built With](#built-with)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

Follow the below instructions to use the rpgs program on your CLI. (Contribution section is in below)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Install the rpgs npm package globally:

```sh
$ npm install rpgs -g
```

## Usage

### Initializing the password manager

```sh
$ rpgs init
```

### Generating a random password

```sh
$ rpgs generate
```

or

```sh
$ rpgs generate -c
$ rpgs generate --copy
```

> The -c or --copy flag the copy the generated password.

### Saving a password with a label

```sh
$ rpgs save
```

### Getting the passwords

```sh
$ rpgs show
```

or

```sh
$ rpgs show -p
$ rpgs show --print
```

> The -p or --print flag will not only copy the saved password but also print it to the terminal so that you can see it.

### Version info

```sh
$ rpgs -v
```

or

```sh
$ rpgs --version
```

### Help

```sh
$ rpgs -h
```

or

```sh
$ rpgs --help
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Built With

- commader.js
- inquirer.js

## Authors

- **Ronak Paul** - _Initial work_ - [ronak-pal1](https://github.com/ronak-pal1)

## License

The license as stated in the LICENSE file.
