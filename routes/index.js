const api = require('express').Router()
const fs = require('fs')
const ms = require('mediaserver')
const path = require('path')
const { WordsDB } = require('../db')
const { Polly } = require('../services/aws')

const getFilePath = (name) => path.resolve(__dirname, '../', 'sounds', `${name}.mp3`)

api.get('/play/:name', (req, res) => {
  const { name } = req.params

  WordsDB.findOne({ name }, (error, word) => {
    if (error) {
      console.log(error)
      return res.json({ error: true })
    }

    if (word) {
      return ms.pipe(req, res, getFilePath(name))
    }

    const params = {
      Text: name,
      OutputFormat: 'mp3',
      VoiceId: 'Kimberly'
    }

    Polly.synthesizeSpeech(params, (error, data) => {
      if (error) {
        console.log(error.code)
        return res.json({ error: true })
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          fs.writeFile(getFilePath(name), data.AudioStream, (err) => {
            if (err) {
              return console.log(err)
            }
            WordsDB.insert({
              name: name
            })
            ms.pipe(req, res, getFilePath(name))
          })
        }
      }
    })
  })
})

api.get('/list', (req, res) => {
  WordsDB.find({}, (error, list) => {
    if (error) {
      console.log(error)
      return res.json({ error: true })
    }
    res.json(list)
  })
})

module.exports = api
