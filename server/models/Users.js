module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
       username: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

         coinsOwned: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]', 
    },
    
    });

  Users.associate = (models) => {
    Users.hasOne(models.Coins, { foreignKey: 'userId', as: 'Coins', onDelete: 'CASCADE' });
    Users.hasMany(models.Likes, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Users.hasMany(models.Posts, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };

  // Sync Coins.amount whenever coinsOwned changes
  Users.afterSave(async (user, options) => {
    const { Coins } = require('./index');
    let coinsArray = [];
    try {
      coinsArray = JSON.parse(user.coinsOwned || '[]');
      if (!Array.isArray(coinsArray)) coinsArray = [];
    } catch (err) {
      coinsArray = [];
    }

    const amount = coinsArray.length;

    const existingCoin = await Coins.findOne({ where: { userId: user.id } });
    if (!existingCoin) {
      await Coins.create({ userId: user.id, amount });
    } else if (existingCoin.amount !== amount) {
      await existingCoin.update({ amount });
    }
  });

  return Users;
};
