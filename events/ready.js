// When the client is ready, run this code (only once)
const { Users } = require('../dbObjects.js');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		async function wait_for_database(){
			const storedBalances = await Users.findAll();
			return storedBalances
		}
		async function fill_the_info(){
			const storedBalances = await wait_for_database()
			storedBalances.forEach(b => client.gameInfo.currency.set(b.user_id, b));	
		}
		fill_the_info();
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setStatus('online')
	},
};