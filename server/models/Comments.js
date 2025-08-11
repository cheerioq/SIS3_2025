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
    postId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {   
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
