const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Users, Shop } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription(`buy items in the shop`)
        .addStringOption((option) =>
        option
            .setName('item')
            .setDescription("What item do you want to buy")
            .addChoices([
                ['Pass (pass your round, one time use.) : $10', 'pass'],
                ['Double (double the money you earn, can only apply 10s before game start): $40', 'double'],
            ])
            .setRequired(true),
    ),

	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const commandUser = interaction.user
		
        const itemName = interaction.options.getString('item')
        const item = await Shop.findOne({ where: { name: { [Op.like]: itemName } } });
        if (!item){
            await interaction.reply({content: `That item doesn't exist.`, ephemeral: true})
            return;
        }else{
            if (item.cost > gameInfo.currency.getBalance(commandUser.id)) {
                await interaction.reply({content: `You currently have ${gameInfo.currency.getBalance(commandUser.id)}, but the ${item.name} costs ${item.cost}!`,
                ephemeral: true})
                return;
            }
            const user = await Users.findOne({ where: { user_id: commandUser.id } });
            gameInfo.currency.add(commandUser.id, -item.cost);
            await user.addItem(item);

            await interaction.reply({content: `You've bought: ${item.name}.`, ephemeral: true});
        }
	},
};