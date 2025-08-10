module.exports = (sequelize, DataTypes) => {

  const Posts = sequelize.define('Posts', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    coinSymbol: {
  type: DataTypes.STRING,
  allowNull: false
}

  });

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {          
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    Posts.hasMany(models.Comments, {
      foreignKey: 'postId',
      onDelete: 'CASCADE',
    });

    Posts.hasMany(models.Likes, {
      foreignKey: 'postId',
      onDelete: 'CASCADE',
    });
  };

  return Posts;
};
