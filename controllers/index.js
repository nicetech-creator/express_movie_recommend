const {
  getRatedMovies,
  getRecommendationByDirector,
  getRecommendationByGenre,
  saveRecommendations,
  getSavedRecommendations,
} = require('../helperFunctions')

async function getRecommendations(req, res) {
  // Check if saved recommendations exists
  try {
    let savedRecommendations = await getSavedRecommendations(req.userId)
    if (savedRecommendations != null){
      console.log('saved response')
      return res.status(200).send(savedRecommendations)
    }
      
  } catch (error) {
    // continue
  }

  // Gets list of movices a user has rated
  let ratedMovies = []
  let ratedMoviesDic = {}  // to speed up filter process

  try {
    ratedMovies = await getRatedMovies(req.userId);
  } catch (error) {
    return res.status(500).send(error.toString())
  }

  // Figure out favorite director, favorite genre
  const RateThreashold = 7
  let favDirector = null
  let favGenre = null
  let directorRatings = {}
  let genreRatings = {}
  let maxDirectorRate = 0
  let maxGenreRate = 0

  ratedMovies.forEach((movie) => {
    ratedMoviesDic[movie.id] = true
    if (movie.userRating >= RateThreashold) {
      if (directorRatings.hasOwnProperty(movie.director)) 
        directorRatings[movie.director] += 1
      else 
        directorRatings[movie.director] = 1
      if (directorRatings[movie.director] > maxDirectorRate) {
        maxDirectorRate = directorRatings[movie.director]
        favDirector = movie.director
      }

      movie.genres.forEach((gen) => {
        if (genreRatings.hasOwnProperty(gen)) 
          genreRatings[gen] += 1
        else 
          genreRatings[gen] = 1
        if (genreRatings[gen] > maxGenreRate) {
          maxGenreRate = genreRatings[gen]
          favGenre = gen
        }
      })
    }
  })

  // get recommended movies by director, genre
  let byDirector = []
  let byGenre = [] 
  try {
    [byDirector, byGenre] = await Promise.all([
      getRecommendationByDirector(favDirector),
      getRecommendationByGenre(favGenre)
    ])
  } catch (error) {
    return res.status(500).send(error.toString())
  }

  // Filter out already seen movies from recommends
  const checkSeen = (movie) => {
    return !ratedMoviesDic.hasOwnProperty(movie.id)
  }
  byDirector = byDirector.filter(checkSeen)
  byGenre = byGenre.filter(checkSeen)

  let recommendations = {
    "favDirector": favDirector,
    "favGenre": favGenre,
    byDirector,
    byGenre
  }

  res.status(200).send(recommendations)
  // save recommedations for the user
  // Don't care about result
  saveRecommendations(req.userId, recommendations)
}

module.exports = {
  getRecommendations,
}