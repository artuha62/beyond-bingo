import { useContext, useEffect, useState } from 'react'
import { ActionsContext } from '../../../../context/CardsContext.jsx'
import { surface } from '../../Surface/CardSurface.module.scss'
import styles from './CardBack.module.css'

const CardBack = ({ card: { id, text }, inputRef }) => {
  const { handleSaveText } = useContext(ActionsContext)

  const [localText, setLocalText] = useState(text)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    handleSaveText(id, localText)
  }

  return (
    <div className={`${surface} ${styles.backSide}`}>
      <form className={styles.form} onBlur={submit} onSubmit={submit}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Напиши что-нибудь..."
          value={String(localText)}
          onChange={(event) => setLocalText(event.target.value)}
        />
      </form>
    </div>
  )
}

export default CardBack
