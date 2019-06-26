const SLL = require('../../LL')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  serializeWord(word, language) {
    return {
      nextWord: word.original,
      totalScore: language.total_score,
      wordCorrectCount: word.correct_count,
      wordIncorrectCount: word.incorrect_count
    }
  },
  getWord(db, id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'correct_count',
        'incorrect_count',
        'memory_value',
        'translation',
        'next'
      )
      .where({ id })
  },
  serializeGuessResponse(word, language, correct) {
    return {
      nextWord: language.head,
      wordCorrectCount: word.correct_count,
      wordIncorrectCount: word.incorrect_count,
      totalScore: language.total_score,
      answer: word.original,
      isCorrect: correct
    }
  },
  updateWord(db, id, correct_count, incorrect_count, memory_value,next){
    return db('word')
    .where({ id })
    .update({
      correct_count,
      memory_value,
      incorrect_count,
      next
    }).returning('*')
  },
  updateNext(db, id, next){
    return db('word')
    .where({ id })
    .update({
      next
    })
    .returning('*')
  },
  updateScore(db, user_id, total_score, head){
    return db('language')
      .where({ user_id })
      .update({
        total_score,
        head
      })
      .returning('*')
  }
}

module.exports = LanguageService
