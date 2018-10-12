/*
  A bot for the MAD Club Discord. Written in Discord.js
*/
/* Variables */
// Import the discord.js module
// Create an instance of a Discord client
const Discord = require('discord.js');
const client = new Discord.Client();

// File path finding
var glob = require('glob');

// Get a list of commands from the commands folder
// This probably needs refactoring but that's ok
var commandList = glob.sync("./commands/*.js").map((file) => {
    return file.split("/")[2].split(".")[0];
});

// Import all settings from the conf.js file
var settings = require('./conf.js');

// Declare variables from the conf.js file
const token = settings.token;

// Other Settings

/* Events */
// This will run when the bot is connected and ready
client.on('ready', () => {
    console.log("Connected!");
    console.log("Logged in as: ");
    console.log(`${client.user.username} - ${client.user.id})`);
    
    // Notify users on server of Bot Connect
    let debugChannel = client.guilds
        .find(x => x.name === 'MAD Club').channels
        .find(x => x.name === 'bot-testing');

    // Checks if the debugGUild channel exists
    if (debugChannel) { 
        debugChannel.send('Reconnected JarrodBot');
    }

    // Output all servers(guilds) that the bot is currently in
    client.guilds.forEach(function(guild) {
        console.log("\nName: " + guild.name);
        console.log("ID: " + guild.id);
        console.log("Members: " + guild.memberCount);
    });
    
    
});


// Respond to messages with various logic
client.on('message', message => {
    // This line prevents from the bot on answering itself
    if (message.author.bot) return;
    
    // Log all messages
    console.log("\n" + message.author.username);
    console.log("in #" + message.channel.name);
    console.log("'" + message.content + "'");
    console.log("----------");

    /* Command Message Logic */

    // this is a way to get the arguments we need in a command just in case we want to go through
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Attempt to load and run the files for us to use
    // This will avoid the many if-else statements
    // We're using a let in here to ref the local scope, so it's not going to be a big deal.
    if (commandList.indexOf(command) !== -1) {
        try {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
    }
    
});


// Respond to the bot disconnecting
client.on("disconnect", () => {
    console.log("Bot disconnected!");
});

// Interracting with the error
client.on('error', err => {
    console.error(err);
});

/* Function Declarations */

/* Log In */
// Log our bot in
client.login(token);
