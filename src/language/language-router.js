const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

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
        req.user.id,
      )
      const word = await LanguageService.getWord(
        req.app.get('db'), 
        language.head)
      if (userAnswer === word[0].original) {
        word[0].correct_count++
        word[0].memory_value*2
        language.total_score+=1
        res.json(LanguageService.serializeGuessResponse(
          word[0], language, true
        ))
      } else {
        word[0].incorrect_count++
        word[0].memory_value = 1
        language.total_score--
        res.json(LanguageService.serializeGuessResponse(
          word[0], language, false
        ))
      }
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
