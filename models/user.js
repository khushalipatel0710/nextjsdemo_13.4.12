const { BOOLEAN } = require('sequelize')
const sequelizePaginate = require('sequelize-paginate')

module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define('User', {
    image: {
      type: DataTypes.STRING
    },
    user_type: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING
    },
    fullname: {
      type: DataTypes.STRING
    },
    
    contact_no: {
      type: DataTypes.STRING
    },
    reset_password_token: {
      type: DataTypes.TEXT
    },
    password: {
      type: DataTypes.STRING
    },
   
  })
  sequelizePaginate.paginate(User)

  return User
}
