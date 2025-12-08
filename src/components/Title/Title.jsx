import { useRef, useState, useEffect } from 'react'
import styles from './Title.module.scss'
import useLocalStorage from '@/hooks/useLocalStorage.js'

const Title = () => {
  const [title, setTitle] = useLocalStorage('title', 'Bingo')
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

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsEditing(false)
  }

  return (
    <form
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onBlur={handleSubmit}
      onSubmit={handleSubmit}
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
        readOnly={!isEditing}
      />
    </form>
  )
}

export default Title
