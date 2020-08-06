require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')


console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const bearerToken = req.get('Authorization').split(' ')[1]
    const apiToken = process.env.API_TOKEN

    console.log('validate bearer token middleware')

   if (bearerToken !== apiToken) {
     return res.status(401).json({ error: 'Unauthorized request' })
   }
   next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIES;
  
    if (req.query.genre) {
      response = response.filter(movie =>
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
    }
  
    if (req.query.country) {
      response = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
    }
  
    if (req.query.avg_vote) {
      response = response.filter(movie =>
        Number(movie.avg_vote) >= Number(req.query.avg_vote)
      )
    }
  
    res.json(response)
  })

const PORT = 8000

app.listen(PORT, () => {
    console.log('Port 8000 ready to go !')
})