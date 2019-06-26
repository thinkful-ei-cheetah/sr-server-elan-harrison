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

// languageRouter
//   .post('/guess', jsonBodyParser, async (req, res, next) => {
//     const { userAnswer } = req.body
//     if (!userAnswer) {
//       return res.status(400).json({
//         error: `Missing user answer in request body`
//       })
//     }
//     try {
//       const language = await LanguageService.getUsersLanguage(
//         req.app.get('db'),
//         req.user.id
//       )
//       const word = await LanguageService.getWord(
//         req.app.get('db'),
//         language.head
//       )
//       let memory_value = word[0].memory_value*2
//       if (memory_value>32){
//         memory_value=32
//       }
      
//       let correct_count= word[0].correct_count
//       let incorrect_count=word[0].incorrect_count
//       let total_score = language.total_score
//       if (userAnswer === word[0].translation){
//         correct_count++
//         total_score++
//       }
//       else {
//         incorrect_count++
//         total_score--
//         memory_value=1
//       }
//       let db = req.app.get('db')
//       LanguageService.updateWord(db, language.head, correct_count, incorrect_count, memory_value)
//       .then(() => {
//         return LanguageService.getLanguageWords(db, req.user.id)
//       }).then( words => {
//         let idx = words.findIndex(word => {
//           word.id == language.head
//         })
//         let output=[]
//         for (let i = idx;i<=words.length; i++){
//           output.push(words.find(w => w.id===i))
//       }
      
//       for (let j =0; j<idx; j++){
//           output.push(words.find(w =>w.id===j))
//       }
      
//       const sll = new LinkedList
//       output.forEach(w =>{
//         if (w){
//         sll.insertValue(w)
//         }
//       })
//       sll.findNextValue()
//       return sll.findNextValue()
//       })
//       .then(id => {
//        db('language')
//         .where({ id : req.user.id })
//         .update({
//         total_score,
//         head:id
//       })
//       })  
//       res.json({
//         total_score,
//         correct_count,
//         incorrect_count
//       })
//       next()
//     } catch (error) {
//       next(error)
//     }
//   })

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
      if (memory_value>16){
        memory_value=16
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
      LanguageService.getLanguageWords(db, language.id)
      .then(words =>{
        let a = words.find(w => w.id = language.head)
        if (a.next ===null){
          let nums = [1,2,3,4,5,6,7,8,9,10]
          words.forEach(w => nums=nums.filter(a => a!=w.next))
          a.next = nums[0]
        }
        let next = a.next
        let M = a.memory_value
        let tmpNode = words.find(word => word.id == next)
        if (M!==16){
          for (let i =0; i<M; i++){
            if (tmpNode.next ===null){
              let nums = [1,2,3,4,5,6,7,8,9,10]
              words.forEach(w => nums=nums.filter(a => a!=w.next))
              tmpNode.next = nums[0]
            }
            let tmpId = tmpNode.id
            let tmpNext = tmpNode.next
            tmpNode = words.find(word => word.id == tmpNext)
          }
          if (memory_value==6){
            memory_value=16
          }
          LanguageService.updateNext(db, tmpId, language.head)
          LanguageService.updateWord(db, language.head, correct_count, incorrect_count, memory_value, tmpNext)
        }
        else{
          M=6
          LanguageService.updateWord(db, language.head, correct_count, incorrect_count, M, word[0].next)
        }
        
      })
      LanguageService.updateScore(db, req.user.id, total_score, head)

      res.json({
        total_score,
        correct_count,
        incorrect_count
      })

      next()
    }
    catch(err){
      next(err)
    }

  })
  module.exports = languageRouter