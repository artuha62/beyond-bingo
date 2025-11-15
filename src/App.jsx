import Bingo from './components/Bingo.jsx'
import { CardsProvider } from './context/CardsContext.jsx'

const App = () => {
  return (
    <CardsProvider>
      <Bingo />
    </CardsProvider>
  )
}

export default App
