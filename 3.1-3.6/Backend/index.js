const express = require('express')
const morgan = require('morgan')
morgan.token('body', (req, res)=>JSON.stringify(req.body))

const app = express()
const logBody = (tokens, req, res) =>{
  return [tokens.url(req, res),
    tokens.status(req,res),
    tokens.body(req, res)
    
  ].join('')
}
app.use(express.json())
app.use(morgan(logBody))
app.use(express.static('../Frontend/dist'))

const Person = require('./db/persons')
const errorHandler = require('./error/error')


app.use(errorHandler)

  app.get("/api/persons", (request, response) =>{
    
    Person.find({}).then(persons =>{
      response.send(persons)
    })
  })

  app.get("/info", (request, response) =>{

    const people = persons.length
    var datetime = new Date()

    response.send(`<h>Phonebook info for ${people} people <h/> <p>${datetime}<p/>`)

  })


  app.get("/api/persons/:id", (request, response, next) =>{
    
    Person.findById(request.params.id)
      .then(person =>{
        if(person){
          response.json(person)
        }else{
          response.status(404).end()
        }
      }).catch(error =>{
       next(error)
      })


  })

  app.delete("/api/persons/:id", (request, response, next)=>{
    Person.findByIdAndDelete(request.body.params).then((result)=>{
      response.status(204).end()
    }).catch(error =>next(error))

  })

  app.post("/api/persons", (request, response)=>{


    const person = request.body
    const p = new Person({
      name: person.name,
      number: person.number
    })

    p.save().then(savedPerson =>{
      response.json(savedPerson)
    })


  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })