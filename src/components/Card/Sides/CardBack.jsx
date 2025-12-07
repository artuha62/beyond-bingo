import { useContext, useEffect, useRef } from 'react'
import { ActionsContext } from '@/context/CardsContext.jsx'
import { surface } from '../Surface/CardSurface.module.scss'
import styles from './CardBack.module.scss'

const CardBack = ({ card: { id, text }, inputRef }) => {
  const { handleSaveText } = useContext(ActionsContext)

  const localTextRef = useRef(text)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    handleSaveText(id, localTextRef.current)
  }

  return (
    <div className={`${surface} ${styles.backSide}`}>
      <form
        className={styles.form}
        onBlur={handleSubmit}
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Напиши что-нибудь..."
          defaultValue={text}
          onChange={(event) => {
            localTextRef.current = event.target.value
          }}
        />
      </form>
    </div>
  )
}

export default CardBack
