const { MessageAttachment, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
                let hand = '<:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                <:diamond_A:889425227300347944>\
                '
                await interaction.reply({ content: hand, ephemeral: true });
            }
            
        }
		
	},
};