import { useRoutes } from 'react-router'
import { routes } from './routes.jsx'

const AppRouter = () => {
  const element = useRoutes(routes)

  return element
}

export default AppRouter
