const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('close')
	.setDescription('close the account, delete the profile in the database'),

	async execute(interaction) {
        const commandUser = interaction.user
        if (!interaction.member.permissions.has("ADMINISTRATOR")){
            await interaction.reply(`Sorry, you do not have the permission.`);
            return;
        }
        
        const user = await Users.findOne({ where: { user_id: commandUser.id } });
        if(!user){
            await interaction.reply({content: 'You are not registered.',ephemeral: true})
            return;
        }else{
            await Users.destroy({ where: { user_id: commandUser.id } });
            await interaction.reply(`User deleted.`)
        }
	}
};