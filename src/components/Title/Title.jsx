import { useRef, useState, useEffect } from 'react'

const Title = () => {
  const [title, setTitle] = useState('Bingo')
  const [isEditing, setIsEditing] = useState(false)

  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
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
      event.preventDefault() // запрещаем перенос строки
      handleSubmit() // подтверждаем
    }
  }

  return (
    <div
      className="title-wrapper"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <input
        ref={inputRef}
        className={`title-input ${isEditing ? 'editing' : 'readonly'}`}
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
