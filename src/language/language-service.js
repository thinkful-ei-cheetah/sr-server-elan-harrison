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
        'memory_value'
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
  }
}

module.exports = LanguageService
