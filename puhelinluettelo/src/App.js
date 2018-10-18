import React from 'react'
import personService from './services/persons'

const Filter = (props) => {
  return (
    <div>
      rajaa näytettäviä: <input id="filtteri" value={props.filter} onChange = {props.onChange}/>
    </div>
  )
}

const Numbers = (props) => {
  const numbersToShow =
    props.data.showAll ?
    props.data.persons :
    props.data.persons.filter(person => person.name.startsWith(props.data.filter))
  return (
    <table>
      <tbody>
        {numbersToShow.map(person =>
        <tr key={person.id}>
          <td>{person.name}</td>
          <td>{person.number}</td>
          <td><button id={person.id} onClick={props.onClick}>poista</button></td>
        </tr>)}
      </tbody>
    </table>
  )
}

const Notification = (props) => {
 
  if (props.message) {
    return (
      <div className="notice">
        {props.message}
      </div>
    )
  }
  return null
}

const Error = (props) => {
  if (props.message) {
    return (
      <div className="error">
        {props.message}
      </div>
    )
  }
  return null
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      index: 0,
      showAll: true,
      filter: '',
      notification: null,
      error: null
    }
  }

  componentWillMount() {
    personService
      .getAll()
      .then(persons => {
        this.setState({persons})
        const indexes = this.state.persons.map(person => person.id)
        this.setState({ index: Math.max(indexes)})
  })
  }

  addNote = (event) => {
    event.preventDefault()
    const names = this.state.persons.map(person => person.name)
    if (!names.includes(this.state.newName)) {
      const nameObject = {
        name: this.state.newName,
        number: this.state.newNumber,
        id: this.state.index + 1
      }
 
      personService
        .create(nameObject)
        .then(newName => {
          this.showNotification("lisättiin "+newName.name)
          this.setState({
            persons: this.state.persons.concat(newName),
            newName: '',
            newNumber: ''
          })
        })
    }
    else {
      if (window.confirm(this.state.newName+" on jo luettelossa, korvataanko vanha numero uudella")) {
      const person = this.state.persons.find(person => person.name === this.state.newName)
      const changedPerson = { ...person, number: this.state.newNumber }
      const id = person.id
      personService
        .update(id, changedPerson)
        .then(changedPerson => {
          this.setState({
            persons: this.state.persons.map(person => person.id !== id ? person : changedPerson),
            newName: '',
            newNumber: ''
          })
          this.showNotification("muutettiin henkilön "+person.name+" numeroa")
        })
        .catch(error => {
          this.setState({
            error: 'muistiinpano '+this.state.newName+' on jo valitettavasti poistettu palvelimelta',
            persons: this.state.persons.map(person => person.id !== id ? person : changedPerson),
            newName: '',
            newNumber: ''
          })
          setTimeout(() => {
            this.setState({error: null})
          }, 5000)
        })
      }
    }
  }
 
  showNotification (message) {
    this.setState({ notification: message })
    setTimeout(() => {
      this.setState({ notification: null})
    }, 5000)
  }

  removeNote = (event) => {
    event.preventDefault()
    const id = event.target.id
    const entry = this.state.persons.filter(person => person.id == id)
    if (window.confirm("Poistetaanko "+entry[0].name)) {
      const entries = this.state.persons.filter(person => person.id != id)
        personService
          .deleteEntry(event.target.id)
          .then(persons => {
            const entries = this.state.persons.filter(person => person.id != id)
            this.setState({persons: entries})
            this.showNotification("poistettiin "+entry[0].name)
          })
          .catch(error => {
            this.setState({
              error: 'muistiinpano '+entry[0].name+' on jo valitettavasti poistettu palvelimelta',
            })
            setTimeout(() => {
              this.setState({error: null})
            }, 5000)
          })
      }
  }

  handleFilterChange = (event) => {
    if (event.target.value) {
      this.setState({ showAll: false })
      this.setState({ filter: event.target.value})
    }

    else {
      this.setState({ showAll: true })
      this.setState({ filter: event.target.value})
    }

  }

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  render() {



    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification message={this.state.notification}/>
        <Error message={this.state.error}/>
        <Filter value={this.state.filter} onChange={this.handleFilterChange} />
        <h2>Lisää uusi</h2>
        <form onSubmit={this.addNote}>
          <div>
            nimi: <input id="nimi" data = {"a"} value={this.state.newName} onChange={this.handleNameChange}/>
          </div>
          <div>
            numero: <input id="numero" value={this.state.newNumber} onChange={this.handleNumberChange}/>
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <h2>Numerot</h2>
          <Numbers data = {this.state} onClick={this.removeNote}/>
      </div>
    )
  }
}

export default App