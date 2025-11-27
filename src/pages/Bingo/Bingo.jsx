import Title from '../../components/Title/Title.jsx'
import LogoutButton from '../../components/UI/LogoutButton.jsx'
import Overlay from '../../components/Overlay/Overlay.jsx'
import CardsGrid from '../../components/CardsGrid/CardsGrid.jsx'
import { CardsProvider } from '../../context/CardsContext.jsx'
import styles from './Bingo.module.css'

const Bingo = () => {
  return (
    <div className={styles.container}>
      <Title />
      <CardsProvider>
        <LogoutButton />
        <CardsGrid />

        <Overlay />
      </CardsProvider>
    </div>
  )
}
export default Bingo
