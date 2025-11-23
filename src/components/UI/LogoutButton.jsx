import { supabase } from '../../services/supabase.js'
import { useContext } from 'react'
import { ActionsContext } from '../../context/CardsContext.jsx'

const LogoutButton = () => {
  const { handleDeleteAllCards } = useContext(ActionsContext)
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
