const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('join')
	.setDescription('join an existing game'),

	async execute(interaction) {
        const commandUser = interaction.user
        const gameInfo = interaction.client.gameInfo
		if(gameInfo.gamePresence == false){
            await interaction.reply(`No game is currently running.`);
            return;
        }else{
            if(gameInfo.players.includes(commandUser.username)){
                await interaction.reply(`You are already in the game.`);
                return;
            }else { // less than MAX_PLAYER
                if(gameInfo.playerCount == gameInfo.MAX_PLAYER){
                    await interaction.reply(`Game is full`);
                    return;
                }else{
                    const user = await Users.findOne({ where: { user_id: commandUser.id } });
                    if(!user){
                        await Users.create({ user_id: commandUser.id, balance: 300, win_count: 0 });
                        gameInfo.currency.add(commandUser.id, -5);
                        await interaction.reply( {content: `Welcome new player ${commandUser.username}, your account has been registered just now.\nThe initial balance is $300.\nThe ticket is $5, enjoy the game.`,
                        ephemeral: true})
                    }else{
                        if(gameInfo.currency.getBalance(commandUser.id) < 5){
                            await interaction.reply( { content:`You don't have enough money to buy a $5 ticket, beg the Admin for some.`,
                            ephemeral: true})
                            return;
                        }else{
                            gameInfo.currency.add(commandUser.id, -5);
                            await interaction.reply({content: `Welcome ${commandUser.username}, you are a registered player.\nThe ticket is $5, you have ${user.balance} dollar left.\nEnjoy the game.`,
                            ephemeral: true})
                        }                    
                    }
                    gameInfo.playersId[commandUser.username] = commandUser.id
                    gameInfo.players.push(commandUser.username)
                    gameInfo.playerCount ++
                    await interaction.followUp(`Joined game successfully!\nNow the game has ${gameInfo.playerCount} players.\nThey are: ${gameInfo.players}\nYou can browse the shop now, you have 10 seconds to apply buffs before game starts.`);
                }
            }
        }
		
	},
};