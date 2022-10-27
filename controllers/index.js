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
  res.send(ratedMovies)
}

module.exports = {
  getRecommendations,
}