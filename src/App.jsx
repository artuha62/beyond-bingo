import useCards from './hooks/useCards.js'
import Title from './components/Title.jsx'
import Bingo from './components/Bingo.jsx'

function App() {
  const { ...cardsData } = useCards()

  return (
    <div className="bingo">
      <Bingo {...cardsData} />
    </div>
  )
}

export default App
