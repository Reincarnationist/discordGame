const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const cardAddress = require('../cardAddress/playingCards.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('challenge')
		.setDescription('Challenge the current playing cards.'),
	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
        const user = interaction.user.username
		if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else if(gameInfo.currentPlayer == user){
            await interaction.reply({ content: `you can't challenge youself.`, ephemeral: true})
            return;
        }else if(!gameInfo.currentDeclaringCards.length){
            await interaction.reply({ content: `you can't challenge as no one has declared any card.`, ephemeral: true})
            return;
        }else if(!gameInfo.currentPlayingCards.length){
            await interaction.reply({ content: `you can't challenge as no one has played any card.`, ephemeral: true})
            return;
        }else if(gameInfo.challenged == true){
            await interaction.reply({ content: `you can't challenge twice.`, ephemeral: true})
            return;
        }else{
            gameInfo.played = false
            gameInfo.challenged = true
            let count = 0

            function wait_for_result(_callback){
                _callback()
            }
            function finish_comparing_dpCardArray(){

                // for(let d of gameInfo.currentDeclaringCards){
                //     for(let p of gameInfo.currentPlayingCards){
                //         if(d[1] == p[1]){
                //             continue;
                //         }else{
                //             count += 1
                //         }
                //     }
                // }

                if(gameInfo.currentDeclaringCards[0][1] != gameInfo.currentPlayingCards[0][1]){
                    count += 1
                }
                wait_for_result(()=>{
                    if(count != 0){
                        //successful challenged
                        function dm_loser(cb){
                            cb()
                        }
                        function get_loser(){
                            let loserId = ''
                            for(let key in gameInfo.playersId){
                                if(key == gameInfo.currentPlayer){
                                    loserId = gameInfo.playersId[key]
                                }
                            }
                            dm_loser(() => {
                                if(loserId != ''){
                                    const str = String(gameInfo.cardPool)
                                     //dm the user for cards he will get
                                    interaction.client.users.fetch(loserId, false).then((user) => {
                                        user.send(`You lied! These cards will be added to your hand as punishment: ${str}.`)
                                    })
                                }else{
                                    console.log('user not found, report the bug.')
                                    console.log(gameInfo.playersId)
                                    console.log(gameInfo.currentPlayer)
                                }
                            })
                        }

                        get_loser();
                        
                        for(let c of gameInfo.cardPool){
                            gameInfo.hands[gameInfo.currentPlayer].push(c)
                        }
                        gameInfo.hands[gameInfo.currentPlayer].sort((a,b) => a[1].localeCompare(b[1]))

                        function second(cb){
                            cb()
                        }
                        function first(){
                            const dhand = gameInfo.getCard(gameInfo.currentDeclaringCards,cardAddress)
                            const phand = gameInfo.getCard(gameInfo.currentPlayingCards,cardAddress)
                            second(() => {
                                const embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`${gameInfo.currentPlayer}'s D and P cards.`)
                                .addField('declared cards: ', dhand)
                                .addField('\u200B', '\u200B')
                                .addField('played cards ', phand);

                                interaction.reply({ embeds: [embed]} );
                            })
                        }
                        first();

                        

                        interaction.followUp({ 
                        content: 
                        `Successful! ${gameInfo.currentPlayer} has to take all the cards in the card pool.\n${gameInfo.cardPool.length} cards go to ${gameInfo.currentPlayer}'s hand.\nIt's ${user}'s turn now.`
                        })
        
                        gameInfo.currentPlayer = user
                        gameInfo.cardPool.length = 0
                        gameInfo.previousDeclaringCards.length = 0
                        gameInfo.resetDPCardArray(gameInfo)
                        gameInfo.playedOnce = true
                        interaction.followUp({ content: `${user}'s round.`,
                                                 embeds: [gameInfo.roundInfo()] });
                    }else{
                        //failed challenge
                        if(gameInfo.hands[gameInfo.currentPlayer].length == 0){
                            function winner_payment(cb){
                                cb()
                            }
                            function get_winner(){
                                let winnerId = ''
                                for(let key in gameInfo.playersId){
                                    if(key == gameInfo.currentPlayer){
                                        winnerId = gameInfo.playersId[key]
                                    }
                                }
                                winner_payment(() => {
                                    if(winnerId != ''){
                                        interaction.client.users.fetch(winnerId, false).then((user) => {
                                            gameInfo.gameEndPayment(user)
                                        })
                                        interaction.followUp({
                                            content: `The Winner is ${user}, he just won ${moneyWon}💰! \nGame ends, type /start to play again.`, 
                                            files: [new MessageAttachment('./congratsGif/impressive-im-impressed.gif')]});
                                        gameInfo.gameStatus = false
                                        return;
                                    }else{
                                        console.log('user not found, report the bug.')
                                        console.log(gameInfo.playersId)
                                        console.log(gameInfo.currentPlayer)
                                    }
                                })
                            }
    
                            get_winner();
                        }
                        
                        const str = String(gameInfo.cardPool)
                        interaction.client.users.fetch(interaction.user.id, false).then((user) => {
                            user.send(`He is innocent! These cards will be added to your hand as punishment: ${str}.`)
                        })

                        

                        for(let c of gameInfo.cardPool){
                            gameInfo.hands[user].push(c)
                        }
                        gameInfo.hands[user].sort((a,b) => a[1].localeCompare(b[1]))
                        //dm the user for cards he will get
                        

                        function second(cb){
                            cb()
                        }
                        function first(){
                            const dhand = gameInfo.getCard(gameInfo.currentDeclaringCards,cardAddress)
                            const phand = gameInfo.getCard(gameInfo.currentPlayingCards,cardAddress)
                            second(() => {
                                const embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`${gameInfo.currentPlayer}'s D and P cards.`)
                                .addField('declared cards: ', dhand)
                                .addField('\u200B', '\u200B')
                                .addField('played cards ', phand);

                                interaction.reply({ embeds: [embed]} );
                            })
                        }
                        first();

                        interaction.followUp({ 
                        content: 
                        `Failed! You have to take all the cards in the card pool.\n${gameInfo.cardPool.length} cards go to ${user}'s hand.\nIt's still ${gameInfo.currentPlayer}'s turn.`
                        })


                        gameInfo.cardPool.length = 0
                        gameInfo.previousDeclaringCards.length = 0
                        gameInfo.resetDPCardArray(gameInfo)
                        gameInfo.playedOnce = true
                        interaction.followUp({ content: `Another round for ${gameInfo.currentPlayer}.`,
                                                embeds: [gameInfo.roundInfo()] });
                            }
                        })
            }
            finish_comparing_dpCardArray()
            

        }
	},
};