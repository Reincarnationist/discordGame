const { MessageAttachment, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const poker = require('../cardAddress/pokerCards.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hand')
		.setDescription(`Display the player's current hand.`),
	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const user = interaction.user.username
        if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else{
            //user does not exist in game
            if(!gameInfo.hands[user]){
                await interaction.reply(`You are not in the game.`)
                return
            }else{
                const hand = gameInfo.getCard(gameInfo.hands[user], poker)
                //more than 20 cards
                if(Array.isArray(hand)){
                    if(typeof hand[1] === 'boolean') await interaction.reply(hand)
                    else{
                        const embed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Below is your hand.')
                            .setDescription('If you have more than 20 cards then the cards after 20th will be displayed as raw data.')
                            .addField('hand before 20th: ', hand[0])
                            .addField('hand after 20th: ', hand[1]);

                        await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }else{
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Below is your hand, you have ${gameInfo.hands[user].length} cards.`)
                        .setDescription('If you have more than 20 cards then the cards after 20th will be displayed as raw data.')
                        .addField('hand: ', hand);
                    
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
            
        }
		
	},
};