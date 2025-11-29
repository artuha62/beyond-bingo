import { useRef, useState, useEffect } from 'react'
import styles from './Title.module.scss'

const Title = () => {
  const [title, setTitle] = useState('Bingo')
  const [isEditing, setIsEditing] = useState(false)

  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      setIsEditing(true)
    }, 400)
  }

  const handlePointerUp = () => {
    clearTimeout(timerRef.current)
  }

  const handleSubmit = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={styles.wrapper}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <input
        ref={inputRef}
        id="bingoTitle"
        className={[
          styles.titleInput,
          isEditing ? styles.editing : styles.readonly,
        ].join(' ')}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        readOnly={!isEditing}
      />
    </div>
  )
}

export default Title
