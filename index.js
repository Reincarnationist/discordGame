// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//initilize game info 
client.gameInfo = {
	MAX_PLAYER : 4,
	gameStatus : false,
	gamePresence: false,
	deck : [],
	players : [],
	playerCount: 0,
	hands : {},
	cardPool : [],
	currentPLayer: null,
	roundInfo : function(){
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Current Round Infomation')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');
		return embed
	},
	getCard: function(card, pokerCards){
		//upload discord string repsentives
	},
}


//commands to be used
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


//event handle
/*The event handler will automatically retrieve and 
register it whenever you restart your bot.*/
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(token);