const {
  getRatedMovies,
  getRecommendationByDirector,
  getRecommendationByGenre,
  saveRecommendations,
  getSavedRecommendations,
} = require('../helperFunctions')

async function getRecommendations(req, res) {
  // Gets list of movices a user has rated
  let ratedMovies = []
  try {
    ratedMovies = await getRatedMovies(req.userId);
  } catch (error) {
    res.status(500).send(error.toString())
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
    res.status(500).send(error.toString())
  }

  res.status(200).send({byDirector, byGenre})
}

module.exports = {
  getRecommendations,
}