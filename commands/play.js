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
        /*
        we use interaction.user here is because database related code needs user.id
        and I'm too lazy to change all the instance, just let it be.
        If somehow the shit really happens, for example, two dummies have the same username
        UNLUCKY I GUESS THEN.
        */
        const user = interaction.user
		if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else if(gameInfo.playerCount != 2){ //gameInfo.MAX_PLAYER
            await interaction.reply(`Not enough players, game ends now.`)
            gameInfo.gameStatus = false
            return;
        }else if(gameInfo.currentPlayer != user.username){
            await interaction.reply({ content: `It's not your turn yet.`, ephemeral: true})
            return;
        }else if(gameInfo.played){
            await interaction.reply({ content: `You have played already.`, ephemeral: true})
            return;
        }else{
            gameInfo.played = true
            gameInfo.challenged = false
            gameInfo.playedOnce = true
            if (interaction.options.getSubcommand() === 'dnp') {
                const dCard = interaction.options.getString('dcard').toUpperCase()
                const pCard = interaction.options.getString('pcard').toUpperCase()
                const regex = /(([1-9]|T|J|Q|K)(S|D|H|C)([,]))+/g
                let dCardArray = []
                let pCardArray = []
                if((!dCard.match(regex)) || dCard.match(regex)[0].length != dCard.length){
                    await interaction.reply({ 
                    content: `Check your command format for declare cards please.`,
                    ephemeral: true})
                    gameInfo.played = false
                    return;
                }else{
                    dCardArray = dCard.match(regex)[0].split(',')
                    dCardArray.pop()

                    if(gameInfo.previousDeclaringCards.length != 0){ 
                        if(gameInfo.GAME_MODE == 0){
                            //same rank variant
                            //must have the same number of cards
                            if(dCardArray.length != gameInfo.previousDeclaringCards.length){
                                await interaction.reply({ 
                                    content: `Your declaration of card number is not valid, please type /play again.`,
                                    ephemeral: true})
                                gameInfo.resetDPCardArray(gameInfo)
                                gameInfo.played = false
                                return;
                            }else{
                                for(let c of dCardArray){
                                    //declared cards' suit does not follow previous declared cards' suit
                                    if(c[1] != gameInfo.previousDeclaringCards[0][1]){
                                        await interaction.reply({ 
                                        content: `Your declaration of card suit is not valid, please type /play again.`,
                                        ephemeral: true})
                                        gameInfo.resetDPCardArray(gameInfo)
                                        gameInfo.played = false
                                        return;
                                    }
                                }
                            }
                        }else if(gameInfo.GAME_MODE == 1){
                            //classic 
                            //cards rank are not the same
                            if(!dCardArray.every((val, i, arr) => val[0] === arr[0][0])){
                                await interaction.reply({ 
                                content: `Your declaration of card rank is not valid, they must be the same.\nplease type /play again.`,
                                ephemeral: true})
                                gameInfo.resetDPCardArray(gameInfo)
                                gameInfo.played = false
                                return;
                            }else{
                                for(let c of dCardArray){
                                    //not same rank, must be higher
                                    if(c[0] != gameInfo.previousDeclaringCards[0][0]){
                                        if(c[0] < gameInfo.previousDeclaringCards[0][0]){
                                            await interaction.reply({ 
                                            content: `Your declaration of card rank is not valid, please type /play again.`,
                                            ephemeral: true})
                                            gameInfo.resetDPCardArray(gameInfo)
                                            gameInfo.played = false
                                            return;
                                        }
            
                                    }else{
                                        //same rank. number of cards must be larger
                                        if(dCardArray.length <= gameInfo.previousDeclaringCards.length){
                                            await interaction.reply({ 
                                            content: `Your declaration of card number is not valid, please type /play again.`,
                                            ephemeral: true})
                                            gameInfo.resetDPCardArray(gameInfo)
                                            gameInfo.played = false
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        //first round
                        if(gameInfo.GAME_MODE == 0){
                            //not same suit
                            if(!dCardArray.every((val, i, arr) => val[1] === arr[0][1])){
                                await interaction.reply({ 
                                content: `Your declaration of card suit is not valid, they must be the same.\nplease type /play again.`,
                                ephemeral: true})
                                gameInfo.resetDPCardArray(gameInfo)
                                gameInfo.played = false
                                return;
                            }
                        }else if(gameInfo.GAME_MODE == 1){
                            //not same rank
                            if(!dCardArray.every((val, i, arr) => val[0] === arr[0][0])){
                                await interaction.reply({ 
                                content: `Your declaration of card rank is not valid, they must be the same.\nplease type /play again.`,
                                ephemeral: true})
                                gameInfo.resetDPCardArray(gameInfo)
                                gameInfo.played = false
                                return;
                            }
                        }
                    }
                    
                }
                if(!pCard.match(regex) || pCard.match(regex)[0].length != pCard.length){
                    await interaction.reply({ 
                    content: `Check your command format for playing cards please.`,
                    ephemeral: true})
                    gameInfo.played = false
                    return;
                }else{ 
                    pCardArray = pCard.match(regex)[0].split(',')
                    pCardArray.pop()
                       
                }
                if(dCardArray.length != pCardArray.length){
                    await interaction.reply({ 
                    content: `Number of declaring cards must match the number of playing cards.\n please type /play again.`,
                    ephemeral: true})
                    gameInfo.resetDPCardArray(gameInfo)
                    gameInfo.played = false
                    return;
                }else{
                    //duplicated play cards
                    if(pCardArray.filter((item, index) => pCardArray.indexOf(item) !== index).length){
                        await interaction.reply({ content: `You can't play same card twice, please type /play again.`, 
                        ephemeral: true})
                        gameInfo.resetDPCardArray(gameInfo)
                        gameInfo.played = false
                        return;
                    }else{
                        for(let c of pCardArray){
                            if(!gameInfo.hands[user.username].includes(c)){ 
                                await interaction.reply({ content: `You don't have ${c} as a playing card, please type /play again.`, 
                                ephemeral: true})
                                gameInfo.resetDPCardArray(gameInfo)
                                gameInfo.played = false
                                return;
                            }
                        }
                    }
                    
                }
                

                //remove those cards from user's hand
                for(let c of pCardArray){
                    if(gameInfo.hands[user.username].indexOf(c) === -1){
                    }else{
                        gameInfo.hands[user.username].splice(gameInfo.hands[user.username].indexOf(c),1)
                        gameInfo.cardPool.push(c)
                    }

                }
                

                gameInfo.currentDeclaringCards  = dCardArray
                gameInfo.currentPlayingCards = pCardArray
                //show declared cards
                const hand = gameInfo.getCard(dCardArray, cardAddress)
                //more than 20 cards
                if(Array.isArray(hand)){
                    if(typeof hand[1] === 'boolean') await interaction.reply(hand[0])
                    else{
                        const embed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`${user.username} plays these cards.`)
                            .setDescription(
                            'If you play more than 20 cards then the cards after 20th will be displayed as raw data.')
                            .addField('cards before 20th: ', hand[0])
                            .addField('cards after 20th: ', hand[1])
                            .addField('Challenge Time: ', 
                            `You have 10 seconds to type /challange if you doubt ${user.username}.`);

                        await interaction.reply({ embeds: [embed]} );
                    }
                }else{
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${user.username} plays these cards.`)
                        .setDescription(
                        'If you play more than 20 cards then the cards after 20th will be displayed as raw data.')
                        .addField('cards played: ', hand)
                        .addField('Challenge Time: ', 
                        `You have 15 seconds to type /challange if you doubt ${user.username}.`);

                    
                    await interaction.reply({ embeds: [embed]});
                }

                // gameInfo.currentDeclaringCards  = dCardArray
                // gameInfo.currentPlayingCards  = pCardArray
                
                //challenge will be inserted during this time if any
                
                //wait 10s for challenges
                setTimeout(function() {
                    //go to challenge.js to handle
                    if(gameInfo.challenged){
                        return;
                    }else{
                        //no one challenged
                        if(gameInfo.hands[user.username].length == 0){
                            gameInfo.gameStatus = false
                            const moneyWon = gameInfo.gameEndPayment(user)
                            
                            interaction.followUp({
                            content: `The Winner is ${user.username}, he just won ${moneyWon}💰! \nGame ends, type /start to play again.`, 
                            files: [new MessageAttachment('./congratsGif/impressive-im-impressed.gif')]});
                            return;
                        }else{
                            gameInfo.played = false
                            gameInfo.playedOnce = true
                            gameInfo.currentPlayer = gameInfo.nextPlayer
                            gameInfo.previousDeclaringCards = gameInfo.currentDeclaringCards
                            //gameInfo.currentDeclaringCards.length = 0
                            gameInfo.currentPlayingCards.length = 0
                            interaction.followUp({ content: `${user.username}'s Round ends.`,
                                            embeds: [gameInfo.roundInfo()] });
                        }
                        
                    }
                    }, (15 * 1000));
            }
        }
    

		
	},
};
