import { supabase } from '../../supabase.js'

const LogoutButton = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  return <button onClick={handleLogout}>Выйти</button>
}

export default LogoutButton
