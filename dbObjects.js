const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const Shop = require('./models/Shop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/Inventory.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(Shop, { foreignKey: 'item_id', as: 'item' });


Users.prototype.addItem = async function(item) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

Users.prototype.deleteItem = async function(item) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
        if(userItem.amount >= 1){
            userItem.amount -= 1;
            return userItem.save();
        }else{
            return;
        }
		
	}

	return;
};


Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

module.exports = { Users, Shop, UserItems };