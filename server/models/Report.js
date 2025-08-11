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

  
  Report.associate = (models) => {
    
  };

  return Report;
};
