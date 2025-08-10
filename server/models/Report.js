module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  // If you want associations later, define here. For now, none needed.
  Report.associate = (models) => {
    // e.g. Report.belongsTo(models.Users, { foreignKey: 'userId' });
  };

  return Report;
};
