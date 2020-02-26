const DataStore = require('nedb')
const path = require('path')

const WordsDB = new DataStore({
  filename: path.resolve(__dirname, 'words.db')
})

WordsDB.loadDatabase((error) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }
})

module.exports = {
  WordsDB
}
