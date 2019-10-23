/*
  A bot for the MAD Club Discord. Written in Discord.js
*/
/* Variables */
// Import the discord.js module
// Create an instance of a Discord client
const Discord = require('discord.js');
const client = new Discord.Client();

// File path finding
let glob = require('glob');

// Get a list of commands from the commands folder
// This probably needs refactoring but that's ok
let commandList = glob.sync("./commands/*.js").map((file) => {
    return file.split("/")[2].split(".")[0];
});

// Import all settings from the conf.js file
let settings = require('./conf.js');

// Declare variables from the conf.js file
const token = settings.token;

// Other Settings
let badword = require('./plugins/badword.js');
let logsChannel;

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
        // debugChannel.send('Reconnected JarrodBot');
    }

    // Output all servers(guilds) that the bot is currently in
    client.guilds.forEach(function(guild) {
        console.log("\nName: " + guild.name);
        console.log("ID: " + guild.id);
        console.log("Members: " + guild.memberCount);
    });

    // finding logs channel
    logsChannel = client.guilds.find(x => x.name === 'MAD Club').channels.find(x => x.name === 'logs');
    
    //finding welcome channel
    let welcomeChannel = client.guilds.find(x => x.name === 'MAD Club').channels.find(x => x.name === 'readme');
    //roles for each year
    let yearRoles = ['412447604740194304', '412447648386252811', '412447711678300160'];
    //rules message id
    let rulesMessage = '503202065854758933'; 
    //years message id
    let yearsMessage = '503202231768711178'; 
 
    if(welcomeChannel) {
        //if found, fetch rules message
        welcomeChannel.fetchMessage(rulesMessage).then(message => {
            //add a default reaction
            message.clearReactions().then(function() {
            	message.react('✅');
            });
            //reaction added
            client.on('messageReactionAdd', (reaction, user) => {
                //check to make sure user isnt bot and channel is welcome channel
                if(user.id != client.user.id && reaction.message.channel.id == welcomeChannel.id) {
                    //user who reacted to the post as a GuildMember
                    let userWhoReacted = message.guild.members.find(x => x.id === user.id);
                    //if the user is not alumni and the reaction added is the checkmark
                    if(!userWhoReacted.roles.find(x => x.id == '438856410521141248')) {
                        if(reaction.emoji.name == '✅') {
                                //give them student role
                                userWhoReacted.addRole('478675916692783114');
                                //clear their reaction
                                reaction.remove(user);
                        }
                    } else {
                        reaction.remove(user);
                    }
                 }       
            });
        }).catch(console.error);
        //fetch select year message
        welcomeChannel.fetchMessage(yearsMessage).then(message => {
            //add options
            message.clearReactions().then(function() {
            	message.react('503059802575077377').then(function() {
            		message.react('503059817762652180').then(function() {
            			message.react('503059830127329291');
            		});
            	});
            });

            client.on('messageReactionAdd', (reaction, user) => {
                //check to make sure user isnt bot and that channel is welcome channel
                if(user.id != client.user.id && reaction.message.channel.id == welcomeChannel.id) {
                    //user who reacted to the post as a GuildMember
                    let userWhoReacted = message.guild.members.find(x => x.id === user.id);
                    //if is not alumni and user selected 1, 2, or 3, give them apporopriate roles
                    if(!userWhoReacted.roles.find(x => x.id == '438856410521141248')) {
                        if(reaction.emoji.id == '503059802575077377') {
                            //give them year 1 role
                            userWhoReacted.addRole(yearRoles[0]);
                            //remove any other year roles they might have
                            userWhoReacted.removeRole(yearRoles[1]);
                            userWhoReacted.removeRole(yearRoles[2]);
                            //clear their reaction
                            reaction.remove(user);
                        } else if(reaction.emoji.id === '503059817762652180') {
                            //give them year 2 role
                            userWhoReacted.addRole(yearRoles[1]);
                            //remove any other year roles they might have
                            userWhoReacted.removeRole(yearRoles[0]);
                            userWhoReacted.removeRole(yearRoles[2]);
                            //clear their reaction
                            reaction.remove(user); 
                        } else if(reaction.emoji.id === '503059830127329291') {
                            //give them year 3 role
                            userWhoReacted.addRole(yearRoles[2]);
                            //remove any other year roles they might have
                            userWhoReacted.removeRole(yearRoles[0]);
                            userWhoReacted.removeRole(yearRoles[1]);
                            //clear their reaction
                            reaction.remove(user); 
                        }
                    } else {
                        reaction.remove(user);
                    }
                }   
            });
        }).catch(console.error);
    }
    
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

    // check for badwords
    badword.run(message);

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

// Respond to message changes with various logic
client.on('messageUpdate', (oldMsg, newMsg) => {
    badword.run(newMsg);
});

// Respond to message being deleted
client.on('messageDelete', (message) => {
    // check that logsChannel exists and that the channel the message was deleted in is not logsChannel
	if(logsChannel && message.channel.id != logsChannel.id) {
		// post deleted message in logsChannel
    	logsChannel.send({embed: {
		    color: 15158332,
		    author: {
		      name: message.author.tag,
		      icon_url: message.author.avatarURL
		    },
		    title: "Deleted in #" + message.channel.name,
		    description: message.content,
		    timestamp: new Date(),
		  }
		});
	}

    // log deleted message in logs
	console.log("\nFROM " + message.author.username);
    console.log("DELETED in #" + message.channel.name);
    console.log("'" + message.content + "'");
    console.log("----------");
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
