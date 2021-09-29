const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('initgame')
	.setDescription('initialize a new game')
	.addIntegerOption((option) => 
						option
						.setName('gamemode')
						.setDescription('Please select your game mode.')
						.addChoices([
							['0', 0],
							['1', 1],
						])
						.setRequired(true),
						),

	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
		const commandUser = interaction.user
		const gameMode = interaction.options.getInteger('gamemode');
		if(!gameInfo.gamePresence){
			gameInfo.gamePresence = true
		}else{
			await interaction.reply(`The Game already exists.`)
			return;
		}

		gameInfo.GAME_MODE = gameMode
		const user = await Users.findOne({ where: { user_id: commandUser.id } });
		if(!user){
			await Users.create({ user_id: commandUser.id, balance: 300, win_count: 0 });
			await gameInfo.currency.add(commandUser.id, -5);
			await interaction.reply({content: `Welcome new player ${commandUser.username}, your account has been registered just now.\nThe initial balance is $300. The ticket is $5.\nEnjoy the game.`,
			ephemeral: true})
		}else{
			if(gameInfo.currency.getBalance(commandUser.id) < 5){
				await interaction.reply({content: `You don't have enough money to buy a $5 ticket, beg the Admin for some.`,
				ephemeral: true})
				return;
			}else{
				await gameInfo.currency.add(commandUser.id, -5);
				await interaction.reply( {content: `Welcome ${commandUser.username}, you are a registered player.\nThe ticket is $5, you have ${gameInfo.currency.getBalance(commandUser.id)} dollar left.\nEnjoy the game.`,
				ephemeral: true})
			}
			
		}
		//add the user who init the game to the player list
		gameInfo.playersId[commandUser.username] = commandUser.id
		gameInfo.players.push(commandUser.username)
		gameInfo.playerCount ++

		await interaction.followUp(`New game initialize succefully by ${gameInfo.players[0]}, \ntype /join to join the game.`);
	},
};