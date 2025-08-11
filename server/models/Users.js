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
      defaultValue: '[]', // Store as JSON string
    },
    
    });

   Users.associate = (models) => {
          Users.hasMany(models.Likes, {
            foreignKey: "userId",
            onDelete: 'CASCADE',
        });

            Users.hasMany(models.Posts, {
                foreignKey: "userId",
                onDelete: 'CASCADE',
            });

            
    };  

    return Users;
};