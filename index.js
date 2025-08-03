const express = require("express")
const cors = require('cors')
const app = express()
const morgan = require("morgan")

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req)=> JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons",(req, res)=>{
    // console.log("request succeeded")
    res.json(persons)
})

app.get("/info",(req, res)=>{
    const info = persons.length
    const date = new Date()
    res.send(`Phonebook has info for ${info} people<br><br>${date}`)
})

app.get("/api/persons/:id",(req, res)=>{
    const id = req.params.id
    const person = persons.find(person => person.id === String(id))
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete("/api/persons/:id",(req, res)=>{
    const id = req.params.id
    persons = persons.filter(person => person.id !== String(id))

    res.status(204).end()
    // res.json(updatedPersons)
})

app.post("/api/persons",(req,res)=>{
    const name = req.body.name
    const number = req.body.number

    checkPerson = persons.find(person => person.name === name)

    if(!name){
        return res.status(400).json({error: "name is missing"})
    }
    if(!number){
        return res.status(400).json({error: "number is missing"})
    }
    if(checkPerson){
        return res.status(400).json({error: "name must be unique"})
    }
    const newPerson = {
        "id": String(Math.floor(Math.random() * 10**3)),
        "name": req.body.name,
        "number": req.body.number
    }

    persons = persons.concat(newPerson)
    return res.status(201).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)