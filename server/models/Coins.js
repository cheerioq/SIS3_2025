module.exports = (sequelize, DataTypes) => {
  const Coins = sequelize.define('Coins', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // number of coins in Users.coinsOwned
    },
  });

  Coins.associate = (models) => {
    Coins.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
  };

  return Coins;
};
