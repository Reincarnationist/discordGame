const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Users, Shop, UserItems } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('buff')
		.setDescription(`use buff items`)
        .addStringOption((option) =>
        option
            .setName('item')
            .setDescription("What item do you want to use")
            .addChoices([
                ['Double', 'double'],
            ])
            .setRequired(true),
    ),

	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const commandUser = interaction.user
        if(gameInfo.buffable == false){
            await interaction.reply({content:`Buff time expires, you can't apply buffs during the game.`,
            ephemeral: true})
            return;
        }
        const itemName = interaction.options.getString('item')
        const item = await Shop.findOne({ where: { name: { [Op.like]: itemName } } });
        if (!item){
            await interaction.reply({content: `That item doesn't exist.`,
            ephemeral: true})
            return;
        }else{
            const user = await Users.findOne({ where: { user_id: commandUser.id } });
            const userItem = await UserItems.findOne({
                where: { user_id: commandUser.id, item_id: item.id },
            });
            if(userItem){
                if(userItem.amount >= 1){
                    await user.deleteItem(item);
                    if(!gameInfo.double[commandUser.username]){
                        gameInfo.double[commandUser.username] = true
                    }
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
            

            await interaction.reply(`You've used: ${item.name}. This only lasts one game.`);
        }
	},
};