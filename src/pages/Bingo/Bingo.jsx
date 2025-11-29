import Overlay from '../../components/Overlay/Overlay.jsx'
import CardsGrid from '../../components/CardsGrid/CardsGrid.jsx'
import { CardsProvider } from '../../context/CardsContext.jsx'
import styles from './Bingo.module.scss'
import Header from '../../components/Header/Header.jsx'

const Bingo = () => {
  return (
    <div className={styles.container}>
      <CardsProvider>
        <Header />
        <CardsGrid />
        <Overlay />
      </CardsProvider>
    </div>
  )
}
export default Bingo
