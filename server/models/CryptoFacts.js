module.exports = (sequelize, DataTypes) => {
  const CryptoFacts = sequelize.define('CryptoFacts', {
    factText: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  });

  return CryptoFacts;
};
