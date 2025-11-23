import Title from '../components/Title/Title.jsx'
import styles from '../components/Bingo/Bingo.module.css'
import LogoutButton from '../components/UI/LogoutButton.jsx'
import Overlay from '../components/Overlay/Overlay.jsx'
import CardsGrid from '../components/CardsGrid/CardsGrid.jsx'

const Bingo = () => {
  return (
    <div className={styles.container}>
      <Title />
      <LogoutButton />
      <Overlay />
      <CardsGrid />
    </div>
  )
}
export default Bingo
