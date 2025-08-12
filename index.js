require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons',(req, res) => {
  Person.find({}).then(result => res.json(result))
})

app.get('/info',(req, res) => {
  const date = new Date()
  Person.countDocuments()
    .then(result => {
      res.send(`Phonebook has info for ${result} people<br><br>${date}`)
    })
})

app.get('/api/persons/:id',(req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if(person){
        res.json(person)
      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons',(req, res, next) => {
  const person = new Person({
    'name': req.body.name,
    'number': req.body.number
  })

  person.save()
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(req, res, next) => {
  const id = req.params.id
  const number = req.body.number

  Person.findByIdAndUpdate(id, { number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if(updatedPerson){
        res.json(updatedPerson)
      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log(error)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  }
  if(error.name === 'ValidationError'){
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)