import { BrowserRouter } from 'react-router'
import AppRouter from '@/router/AppRouter.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
