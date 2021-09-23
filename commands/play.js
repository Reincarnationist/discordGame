const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const cardAddress = require('../cardAddress/playingCards.js');
module.exports = {
    //!!! need subcommand group, delcared cards => actual cards
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play cards as you choosed. Format is /play cards 1S, 2D, KH, QD, ...')
        .addSubcommandGroup(group =>
            group
                .setName('cards')
                .setDescription("Cards you want to declare and play.")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('dnp')
                        .setDescription('cards you want to declare')
                        .addStringOption(option => option
                            .setName('dcard')
                            .setDescription("pick cards you want to declare")
                            .setRequired(true),)
                        .addStringOption(option => option
                        .setName('pcard')
                        .setDescription("pick cards you want to play")
                        .setRequired(true),) 
                            ),
        ),

	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const user = interaction.user.username
        //test use!!!!!!!
        gameInfo.currentPlayer = user
		if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else if(gameInfo.currentPlayer != user){
            await interaction.reply({ content: `It's not your turn yet.`, ephemeral: true})
            return;
        }else if(gameInfo.played){
            await interaction.reply({ content: `You have played already.`, ephemeral: true})
            return;
        }else{
            gameInfo.played = true
            if (interaction.options.getSubcommand() === 'dnp') {
                const dCard = interaction.options.getString('dcard').toUpperCase()
                const pCard = interaction.options.getString('pcard').toUpperCase()
                const regex = /(([1-9]|T|J|Q|K)(S|D|H|C)([,]))+/g
                let dCardArray = []
                let pCardArray = []
                if(!dCard.match(regex)){
                    await interaction.reply({ content: `Check your command format for declare cards please.`,
                     ephemeral: true})
                    gameInfo.played = false
                    return;
                }else{ 
                    dCardArray = dCard.match(regex)[0].split(',')
                    dCardArray.pop()
                }
                if(!pCard.match(regex)){
                    await interaction.reply({ content: `Check your command format for playing cards please.`,
                     ephemeral: true})
                     gameInfo.played = false
                    return;
                }else{ 
                    pCardArray = pCard.match(regex)[0].split(',')
                    pCardArray.pop()
                }

                for(let c of pCardArray){
                    if(!gameInfo.hands[user].includes(c)){
                        dCardArray.length = 0 
                        pCardArray.length = 0 
                        await interaction.reply({ content: `You don't have ${c} as a playing card, please type /play again.`, 
                                            ephemeral: true})
                        gameInfo.played = false
                        return;
                    }
                }

                //remove those cards from user's hand
                for(let c of pCardArray){
                    gameInfo.hands[user].splice(gameInfo.hands[user].indexOf(c),1)
                }
                if(gameInfo.hands[user].length == 0){
                    await interaction.reply({ content: `The Winner is ${user}!\nGame ends.`, 
                    files: [new MessageAttachment('./congratsGif/impressive-im-impressed.gif')]});
                    gameInfo.gameStatus = false
                    return
                }else{
                    const hand = gameInfo.getCard(pCardArray, cardAddress)
                    //more than 20 cards
                    if(Array.isArray(hand)){
                        if(typeof hand[1] === 'boolean') await interaction.reply(hand[0])
                        else{
                            const embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`${user} plays these cards.`)
                                .setDescription('If you play more than 20 cards then the cards after 20th will be displayed as raw data.')
                                .addField('cards before 20th: ', hand[0])
                                .addField('cards after 20th: ', hand[1]);

                            await interaction.reply({ embeds: [embed]} );
                        }
                    }else{
                        const embed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`${user} plays these cards.`)
                            .setDescription('If you play more than 20 cards then the cards after 20th will be displayed as raw data.')
                            .addField('cards played: ', hand);
                        
                        await interaction.reply({ embeds: [embed]});
                    }
                    //wait 10s for challenges
                    setTimeout(function() {
                        gameInfo.played = false
                        gameInfo.currentPlayer = gameInfo.nextPlayer
                        interaction.followUp({ content: `${user}'s Round ends.`,
									 embeds: [gameInfo.roundInfo()] });
                        }, (10 * 1000));
                }
            }
        }

		
	},
};