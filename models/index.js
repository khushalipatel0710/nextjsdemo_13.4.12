'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'

const db = {}

let sequelize
console.log('process.env............', process.env.DATABASE_URL)

// just make this

  sequelize = new Sequelize({
    username: 'postgres',
    password: '123456789',
    database: 'postgres',
    host: 'localhost',
    dialect: 'postgres'
  })


// sequelize.sync({ alter: true })

// SOLUTION FROM -https://github.com/dyarfi/nextjs-sequelize/issues/14
var files
try {
  files = require.context('./', false, /\.js$/i)
  files.keys().forEach(key => {
    if (key.includes('index')) {
      return
    }
    const model = files(key)(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })
} catch (err) {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
      // const model = sequelize.import(path.join(__dirname, file));
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
      db[model.name] = model
    })
}

// files.keys().forEach(key => {
//   if (key.includes('index')) {
//     return
//   }
//   const model = files(key)(sequelize, Sequelize.DataTypes)
//   db[model.name] = model
// })
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
