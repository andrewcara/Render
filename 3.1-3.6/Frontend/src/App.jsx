import { useState } from "react";
import peopleService from "../srv/server";
import { useEffect } from "react";



const Filter = ({ setSearch }) => {
  return (
    <>
      <h2>Search Criteria</h2>
      <div>
        name: <input onChange={(e) => setSearch(e.target.value)} />
      </div>
    </>
  );
};
const Name = ({ setName }) => {
  return (
    <>
      <h2>Phonebook</h2>
      <div>
        name: <input onChange={(e) => setName(e.target.value)} />
      </div>
    </>
  );
};
const Number = ({ setNumber }) => {
  return (
    <div>
      number: <input onChange={(e) => setNumber(e.target.value)} />
    </div>
  );
};



const App = () => {

  const messageStyle = {
    color: 'green',
    fontStyle: 'italic'
  }



  useEffect(() => {
    peopleService.getPeople().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const displayMessage = (message, type) =>{
    setUserMessage(
      `${message} (${type.name})`
    )
    setTimeout(() => {
      setUserMessage("")
    }, 5000)
  }

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [userMessage, setUserMessage] = useState("")

  const handleForm = (e) => {
    e.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      
      const updatedPerson = persons.find(p => p.name === newName)
      
      peopleService.updatePerson({...updatedPerson, number:newNumber}).then((response)=>{
        
        const updatedPersons = persons.map(person =>
          person.id !== updatedPerson.id ? person : response
        );
        displayMessage("User was updated", response)
        setPersons(updatedPersons)
      })
    } else {
      var person_obj = { name: newName, number: newNumber };
      peopleService.postPerson(person_obj).then((response) => {
        console.log(response)
        setPersons(persons.concat({ ...person_obj, id: response.id }));
        setNewName("");
        setNewNumber("");
        displayMessage("User was created", person_obj)

      });
    }
  };

  const handleDelete = (id) =>{
    peopleService.deletePerson(id).then((request =>{
      var temp = persons.filter(
        (person => person.id !== id))
        setPersons(temp)
      })
    ).catch((error)=>{
      displayMessage("Error User No Longer Exists", id)
    })
  }

  const filteredDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      {userMessage && <p style={messageStyle}>{userMessage}</p>}
      <Filter setSearch={setSearch} />
      <form onSubmit={handleForm}>
        <Name setName={setNewName} />
        <Number setNumber={setNewNumber} />
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>

      {filteredDisplay.map((value) => {
        return (
          <p key={value.id}>
            {value.name} {value.number}
            <button onClick={() => handleDelete(value.id)}></button>
          </p>
        );
      })}
    </div>
  );
};

export default App;
