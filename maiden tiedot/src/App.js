import React from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <div>
      find countries: <input id="filtteri" value={props.data.filter} onChange = {props.onChange}/>
    </div>
  )
}

const Countries = (props) => {

  if (props.countries.length > 1 && props.countries.length < 10) {
    const c = props.countries.map(country => country.name)
    return (
      <div>
        {props.countries.map(country =>
        <li onClick = {props.onClick} id={country.name} key={country.name}>{country.name}</li>)}
      </div>
    )
  }
  if (props.countries.length > 9) {
    return (
      <div>
        too many matches, spesify another filter
      </div>
    )
  }
   
  return (<div></div>)
}

const Country = (props) => {
  if (props.data.showCountry) {
    return (
      <div>
        <p>Capital: {props.data.capital}</p>
        <p>Population: {props.data.population}</p>
        <img src = {props.data.flag}/>
      </div>
    )
  }
  return (<div></div>)
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      selected: [],
      filter: '',
      fetch: 'countries',
      capital: '',
      population: '',
      flag: '',
      showFlag: false
    }
  }

 
  componentWillMount() {
    if (this.state.countries.length === 0) {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => {
          this.setState({ countries: response.data })
          console.log(response.data)
      })
    }
  }


  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value })
    const selected = this.state.countries.filter(country => (
      country.name.toLowerCase().includes(event.target.value.toLowerCase()))
    )
    this.setState({ selected: selected })
    if (selected.length === 1){
      axios
        .get('https://restcountries.eu/rest/v2/name/' + selected[0].name + '?fullText=true')
        .then(response => {
          const country = response.data[0]
          this.setState({ capital: country.capital })
          this.setState({ population: country.population })
          this.setState({ flag: country.flag })
          this.setState({ showCountry: true })
      })
      console.log("Nimi", selected[0].name)
    }
    else {
      this.setState({ showCountry: false })
    }
  }

  handleClick = (event) => {
    axios
        .get('https://restcountries.eu/rest/v2/name/' + event.target.id + '?fullText=true')
        .then(response => {
          const country = response.data[0]
          this.setState({ capital: country.capital })
          this.setState({ population: country.population })
          this.setState({ flag: country.flag })
          this.setState({ showCountry: true })
      })
  }

  render() {


    return (
      
      <div>
          <Filter data={this.state} value={this.state.filter} onChange={this.handleFilterChange} />
          <Countries countries = {this.state.selected} data={this.state} onClick={this.handleClick} />
          <Country data={this.state}/>
      </div>

    )
  }
}

export default App