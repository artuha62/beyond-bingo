import { supabase } from '../../services/supabase.js'
import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'

const LogoutButton = () => {
  const { handleDeleteAllCards } = useContext(CardsContext)
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  return (
    <div>
      <button onClick={handleDeleteAllCards}>Удалить все карточки</button>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  )
}

export default LogoutButton
