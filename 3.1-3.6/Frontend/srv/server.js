import axios from 'axios'

const url = "http://localhost:3001/api/persons"

const postPerson = (person) =>{

    const request = axios.post(url, person)
        return request.then((response)=>(response.data
        ))

}


const getPeople = () => {
    return axios.get(url)

}


const deletePerson = (id) =>{
    const request = axios.delete(url+"/"+id)
    return request.then(response =>(response.data))
}

const updatePerson = (person) =>{
    const request = axios.put(url+"/"+person.id, person)
    return request.then(response => (response.data))
}

export default {postPerson, getPeople, deletePerson, updatePerson}