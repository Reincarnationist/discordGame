const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Shop = require('./models/Shop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/Inventory.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		Shop.upsert({ name: 'Pass', cost: 10 }),
		Shop.upsert({ name: 'Double', cost: 40 }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);