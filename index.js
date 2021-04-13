
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('find', (request, response) => {
    return JSON.stringify({name: request.body.name, number: request.body.number})
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :find'))



let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Mary Poppendick",
        number: "39-23-6423122"
      }
    ]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

let today = new Date()
let info =  "Phonebook has info for " + persons.length + " people <br/>" + today

app.get('/api/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const result = persons.find(({name}) => name === body.name)
    if (result) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    persons = persons.concat(person)
    response.json(person)
    console.log(body.name, result)
   
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})