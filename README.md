# RinsedBot
A bot for the MAD Club Discord.

# Setup

## Pre-requisites

- Node
- NPM

### MacOS

**Homebrew:** (Recommended)

Use Homebrew to install by doing:

- `brew install node`

Then verify using `node -v` to verify your version is there and `npm -v`.

**MacOS Installer:**

You can also use this if you like:

https://nodejs.org/en/download/


### Linux/Ubuntu

- If you're using this, you should install nodejs from one of the linux package managers. In this case `apt-get install`.

## Docker installation

- Clone the project

- Build the docker images using the following command: `docker build -t rinsedbot .`

- Start the docker image using the following command: `docker run --restart=always -d rinsedbot`

- Optionally, start as a non-root user Ex. `docker run --user 1003 --restart=always -d rinsedbot`

## Installation

- Fork the repo to your computer. To do this, click on the `fork` button on the top-right hand corner.
- Go to your directory, and open up terminal. Type in `npm install`. This should install all the dependicies you need for this project.
- Duplicate `conf.example.js` and rename it to `conf.js`.
- Insert your token into the `conf.js` file where specified.

