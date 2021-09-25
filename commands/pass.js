const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Users, Shop, UserItems } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pass')
		.setDescription(`Pass the current round`),
	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const commandUser = interaction.user
        if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else if(gameInfo.currentPlayer != commandUser.username){
            await interaction.reply({ content: `It's not your turn yet.`, ephemeral: true})
            return;
        }else{
            const user = await Users.findOne({ where: { user_id: commandUser.id } });
            const item = await Shop.findOne({ where: { name: { [Op.like]: 'Pass' } } });
            const userItem = await UserItems.findOne({
                where: { user_id: commandUser.id, item_id: item.id },
            });

            if(userItem){
                if(userItem.amount >= 1){
                    await user.deleteItem(item);
                    gameInfo.currentPlayer = gameInfo.nextPlayer
                    await interaction.reply({ content: `${commandUser.username}'s Round ends.`,
                                             embeds: [gameInfo.roundInfo()] });
                }else{
                    await interaction.reply({content: `You don't have enough ${item.name}. You can type /buy to buy items in the shop.`,
                    ephemeral: true})
                    return;
                }
                
            }else{
                await interaction.reply({content: `You don't have any ${item.name}. You can type /buy to buy items in the shop.`,
                ephemeral: true})
                return;
            }
        }
            
        
		
	},
};