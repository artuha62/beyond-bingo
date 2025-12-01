import styles from './Overlay.module.scss'

const Overlay = () => {
  return (
    <div
      className={`${styles.overlay} ${active ? styles.open : ''}}`}
      onClick={onClick}
    />
  )
}

export default Overlay
