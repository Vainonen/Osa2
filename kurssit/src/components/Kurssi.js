import React from 'react'

const Kurssi = ({kurssi}) => {
  return ( 
    <div>
      <Otsikko key={kurssi.id} otsikko={kurssi.nimi}/>
      <ul>
        {kurssi.osat.map(osa=><Osa key={osa.id} osa={osa}/>)}
        <Summa osat={kurssi.osat}/>
      </ul> 
    </div> 
  )
}

const Otsikko = ({otsikko}) => {
  return (
    <h2>{otsikko}</h2>
  )
}

const Osa = ({osa}) => {
  return (
    <li>{osa.nimi} {osa.tehtavia}</li>
  )
}

const Summa = ({osat}) => {
  const tehtavat = osat.map(osa => osa.tehtavia)
  var summa = tehtavat.reduce((accumulator, currentValue) => accumulator + currentValue)
  return (
    <p>yhteensä {summa} tehtävää</p>
  )
}

export default Kurssi