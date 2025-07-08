const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

const persons = [
    {
      id: "1",
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: "2",
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: "3",
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: "4",
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
  ];


  app.get("/api/persons", (request, response) =>{
    response.send(persons)
  })

  app.get("/info", (request, response) =>{

    const people = persons.length
    var datetime = new Date()

    response.send(`<h>Phonebook info for ${people} people <h/> <p>${datetime}<p/>`)

  })

  app.get("/api/persons/:id", (request, response) =>{
    const id = request.params.id

    const person = persons.find((person)=>person.id===id)

    if(person){
        response.send(person)
    }else{
        return response.status(400).json({ 
            error: 'content missing' 
          })
       
    }


  })

  app.delete("/api/persons/:id", (request, response)=>{
    const id = request.params.id

    const new_persons = persons.filter((person)=>person.id!==id)
    console.log(new_persons)
    response.status(204).end()

  })


  
const generateID = () =>{
    return String(Math.floor(Math.random() * (1000)))
}

  app.post("/api/persons", (request, response)=>{


    var person = request.body

    if(!person.name){
        return response.status(400).json( "Bad Request")
           
    }else if(!person.number){
        return response.status(400).json( "Bad Request")
    }else if(persons.find((p)=>p.name===person.name)){
        return response.status(400).json( "Bad Request")
    }

    person = {...person, id:generateID()}

    persons.concat(person)

    response.send(person)


  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })