import { BrowserRouter } from 'react-router'
import AppRouter from './router/AppRouter.jsx'
import { CardsProvider } from './context/CardsContext.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <CardsProvider>
        <AppRouter />
      </CardsProvider>
    </BrowserRouter>
  )
}

export default App
