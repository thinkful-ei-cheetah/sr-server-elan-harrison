const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./Linked-List')
const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      const firstWord = await LanguageService.getWord(
        req.app.get('db'),
        language.head
      )
      res.json(LanguageService.serializeWord(firstWord[0], language))
      
      next()
    } catch (error){
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const { userAnswer } = req.body
    if (!userAnswer) {
      return res.status(400).json({
        error: `Missing user answer in request body`
      })
    }
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id
      )
      const word = await LanguageService.getWord(
        req.app.get('db'),
        language.head
      )
      let memory_value = word[0].memory_value*2
      if (memory_value>32){
        memory_value=32
      }
      
      let correct_count= word[0].correct_count
      let incorrect_count=word[0].incorrect_count
      let total_score = language.total_score
      if (userAnswer === word[0].translation){
        correct_count++
        total_score++
      }
      else {
        incorrect_count++
        total_score--
        memory_value=1
      }
      let db = req.app.get('db')
      LanguageService.updateWord(db, language.head, correct_count, incorrect_count, memory_value)
      .then(() => {
        return LanguageService.getLanguageWords(db, req.user.id)
      }).then( words => {
        let idx = words.findIndex(word => {
          word.id == language.head
        })
        let output=[]
        for (let i = idx;i<=words.length; i++){
          output.push(words.find(w => w.id===i))
      }
      
      for (let j =0; j<idx; j++){
          output.push(words.find(w =>w.id===j))
      }
      
      const sll = new LinkedList
      output.forEach(w =>{
        if (w){
        sll.insertValue(w)
        }
      })
      sll.findNextValue()
      return sll.findNextValue()
      })
      .then(id => {
       db('language')
        .where({ id : req.user.id })
        .update({
        total_score,
        head:id
      })
      })  
      res.json({
        total_score,
        correct_count,
        incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
