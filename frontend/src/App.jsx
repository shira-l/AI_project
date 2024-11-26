import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Form from './components/Form'
import MultipleSelectChip from './components/MultipleSelectChip'
import './App.css'

function App() {

  const [displayWebCreation, setDisplayWebCreation] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  return (
    <>
      {<Form setDisplayForm={setDisplayForm} />}
      {displayForm && <div>
        <button>DOWNLOAD PDF</button>
        <button onClick={() => { setDisplayWebCreation(!displayWebCreation) }}>create website home page for your business</button>
      </div>}
      {displayWebCreation && <div style={{ display: 'flex', justifyContent: 'space-around' }}><MultipleSelectChip type={"options"} /><MultipleSelectChip type={"colors"} /></div>}
    </>
  )
}

export default App
