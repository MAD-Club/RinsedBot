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

const StClairAPI = require('./StClairAPI.js');
var madAPI = new StClairAPI(settings.apiKey);

// Declare variables from the conf.js file
var tokenn = settings.tokenn;

// The token of your bot - https://discordapp.com/developers/applications/me
const token = tokenn;

var messageCount = 0;
var restartCount = Math.floor(Math.random() * 25) + 5; // Sets a minimum of 5, maximum of 30

/* Events */
// This will run when the bot is connected and ready
client.on('ready', () => {
    console.log("Connected!");
    console.log("Logged in as: ");
	console.log(`${client.user.username} - ${client.user.id})`);
    
    // Notify users on server of Bot Connect
    // Find the testing server
    var debugGuild = client.guilds.find('name', 'MAD Club');
    
    // Checks if the debugGUild channel exists
    if (debugGuild) { 
        // Find the debug channel
        var debugChannel = debugGuild.channels.find('name', 'bot-testing');
        // Checks if that channel exists
        if (debugChannel) {
            debugChannel.send("Just got back from a Slurp!(reconnected)");
        }
    }

    console.log("Messages until next JarrodNoise: " + restartCount);

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
    if (message.content.indexOf(settings.prefix) !== 0) return;
    
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
    } else {
        message.channel.send("This command doesn't exist!");
    }
    // } else if (message.content.toLowerCase() === "!currentnews") {
    //     // retrieve from the news
    //     madAPI.getCurrentNews(function(error, response, body) {
    //         if (response.statusCode === 200) {
    //             let data = JSON.parse(body);
    //             let updatedNews = data.sort(function(a, b) {
    //                 return new Date(a.createdAt) < new Date(b.createdAt)
    //             });
    //             content = "**" + updatedNews[0].title + "**\n\n";
    //             content += updatedNews[0].content;

    //             message.channel.send(content);
    //         }
    //     });
    // } else if (message.content.toLowerCase() === "!currentevents") {
    //     // retrieve the event
    //     madAPI.getCurrentEvents(function(error, response, body) {
    //         if (response.statusCode === 200) {
    //             let data = JSON.parse(body);
    //             let updatedEvents = data.sort(function(a, b) {
    //                 return new Date(a.createdAt) < new Date(b.createdAt)
    //             });

    //             content = "**" + updatedEvents[0].title + "**";
    //             content += "\n" + updatedEvents[0].description;
    //             content += "\nStart Date: " + new Date(updatedEvents[0].startDate);
    //             content += "\nEnd Date: " + new Date(updatedEvents[0].endDate);

    //             message.channel.send(content);
    //         }
    //     });
    // }
    /* Messaging Logic that is separate from normal commands */
    // If the message contains 'android'
    if (message.content.toLowerCase().includes('android')) {
        // Send "pong" to the same channel
        message.channel.send('R dot ID dot');
    }
    if (message.content.toLowerCase().includes('swift')) {
        // Send "pong" to the same channel
        message.channel.send('Are you using Kotlin?');
    }
    if (message.content.toLowerCase().includes('dramamine')) {
        // Send "pong" to the same channel
        message.channel.send('If I get 1000 people to join the Dollar Shave Club, I get 83 years of free razers.');
    }
    if (message.content.toLowerCase().includes('gucci')) {
        // Send "pong" to the same channel
        message.channel.send('Did you go to bed last night?');
    }
    if (message.content.toLowerCase().includes('gucci gang')) {
        // Send "pong" to the same channel
        message.channel.send('Gucci gang, Gucci gang, Gucci gang, Gucci gang\nGucci gang, Gucci gang, Gucci gang (Gucci gang!)');
    }
    if (message.content.toLowerCase().includes('kanye')) {
        // Send "pong" to the same channel
        message.channel.send('Buy some Kanye Coin!');
    }
    if (message.content.toLowerCase().includes('slurp') && message.author.id !== client.user.id) {
        // Send "pong" to the same channel
        message.channel.send('You up for a slup?');
    }
    if (message.content.toLowerCase().includes('diesel')) {
        // Send "pong" to the same channel
        message.channel.send('Gotta drink that Mid');
    }
    // Only respond to this if this message was not sent by the bot
    if (message.content.toLowerCase().includes('rinsed') && message.author.id !== client.user.id) {
        // Send "pong" to the same channel
        message.channel.send('I got Rinsed!');
    }

    /* JarrodNoises Area*/
    messageCount++;
    
    if(messageCount === restartCount) {
        // Only sends this message if the last message was not sent by the bot
        if(message.author.id !== client.user.id){
            message.channel.send("You've got to be kidding me!"); // Send a message after every 5th message after .5 seconds
            messageCount = 0;
            restartCount = Math.floor(Math.random() * 25) + 5;
            console.log("messages until next JarrodNoise: " + restartCount);
        } else {
            messageCount--;
        }
    }
    
});

/* Working, but not needed */
/*client.on("presenceUpdate", function(oldPresence, newPresence) {
    
    
	console.log(oldPresence.user.username + " was " + oldPresence.presence.status);
	console.log(newPresence.user.username + " is " + newPresence.presence.status + "\n");
    
});*/


// Respond to the bot disconnecting
client.on("disconnect", () => {
    console.log("Bot disconnected!");
});

/* Function Declarations */

/* Log In */
// Log our bot in
client.login(token);