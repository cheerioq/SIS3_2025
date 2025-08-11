module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {  // explicit foreign key to Posts
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {   // FK to Users, allow null initially
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Posts, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
    Comments.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Comments;
};
