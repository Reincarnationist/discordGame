const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription(`get user's inventory`),

	async execute(interaction) {
        const commandUser = interaction.user
        const user = await Users.findOne({ where: { user_id: commandUser.id } });
        const items = await user.getItems();
        if (!items.length){
            await interaction.reply({content: `${commandUser.username} has nothing!`,
            ephemeral: true})
        }else{
            await interaction.reply({content: `${commandUser.username} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`,
            ephemeral: true});
        }
		
	},
};