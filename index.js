require('env')
require('./db')

const server = require('express')()
const PORT = process.env.PORT || 7070

server.use((require('./routes')))

server.listen(PORT, () => {
  console.log(`
  
  GO: http://localhost:${PORT}

  `)
})
