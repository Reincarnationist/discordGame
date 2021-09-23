// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//initilize game info 
//cardPool is for internal use only, should not be displayed
client.gameInfo = {
	MAX_PLAYER : 4,
	gameStatus : false,
	gamePresence : false,
	played : false,
	deck : [],
	players : [],
	playerCount : 0,
	hands : {},
	cardPool : [],
	currentPlayer : '',
	nextPlayer : '',
	nextPlayerSetterAndGetter: function(){
		//not the last one
		if(this.players.indexOf(this.currentPlayer) != this.players.length-1){
			this.nextPlayer = this.players[this.players.indexOf(this.currentPlayer) + 1]
		}else{
			this.nextPlayer = this.players[0]
		}
		return this.nextPlayer
	},
	roundInfo: function(){
		let dangerPlayer = []
		for(let keys in this.hands){
			if(this.hands[keys].length < 5){
				if(!dangerPlayer.includes(keys)) dangerPlayer.push(keys)
			}else{
				if(dangerPlayer.includes(keys)) dangerPlayer.splice(dangerPlayer.indexOf(keys),1)
			}
		}
		
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Current Round Infomation')
			.setDescription(`This is ${this.currentPlayer}'s turn.'`)
			.addField(`Total card pool has`, `${this.cardPool.length} cards.`)
			.addField(`There are ${dangerPlayer.length} players having less than 5 cards!`, `They are ${String(dangerPlayer)}`)
			.addField(`Next player is`, `${this.nextPlayerSetterAndGetter()}`);
		
		return embed
		
	},
	getCard: function(cards, cardAddress){
		if(cards.length == 0){
			const error_msg = `Player's hand is empty. Please contact the admin to report the bug.` 
			let return_array = [error_msg,true]
			return return_array
		}else if(cards.length <= 20){
			let res = ''
			let first_part = ''
			let second_part = '\n'
			for(let card of cards){
					//black cards
				if(card[1] === 'S' || card[1] === 'C'){
					first_part += cardAddress['b' + card[0]]
				}else{
					//red cards
					first_part += cardAddress['r' + card[0]]
				}
				second_part += cardAddress[card[1]]
			}
			res = first_part + second_part
			return res
		}else{
			let res = ''
			let first_part = ''
			let second_part = '\n'
			const rest = cards.slice(20)
			let return_array = []
			for(let card of cards.slice(0,20)){
					//black cards
				if(card[1] === 'S' || card[1] === 'C'){
					first_part += cardAddress['b' + card[0]]
				}else{
					//red cards
					first_part += cardAddress['r' + card[0]]
				}
				second_part += cardAddress[card[1]]
			}
			res = first_part + second_part
			return_array = [res,String(rest)]
			return return_array
		}
		
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