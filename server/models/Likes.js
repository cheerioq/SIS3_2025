module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    Likes.belongsTo(models.Posts, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
  };

  return Likes;
};
