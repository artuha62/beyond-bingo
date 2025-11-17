import { useContext, useEffect } from 'react'
import { CardsContext } from '../../../../context/CardsContext.jsx'
import base from '../../Surface/CardBase.module.css'
import styles from './CardBack.module.css'

const CardBack = ({ card: { id, text }, inputRef }) => {
  const { handleSubmit, handleInputChange } = useContext(CardsContext)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  return (
    <div className={`${base.base} ${styles.backSide}`}>
      <form
        className={styles.form}
        onBlur={(event) => handleSubmit(id, event)}
        onSubmit={(event) => handleSubmit(id, event)}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Напиши что-нибудь..."
          value={text}
          onChange={(event) => handleInputChange(id, event.target.value)}
        />
      </form>
    </div>
  )
}

export default CardBack
