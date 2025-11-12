import { useCallback, useEffect, useRef, useState } from 'react'

const useCards = () => {
  const timerRef = useRef(null)
  // ---STATE---
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('cards')
    return savedCards
      ? JSON.parse(savedCards)
      : [
          {
            id: Date.now(),
            text: '',
            count: 0,
            isFlipped: false,
            isEditing: true,
            shouldSpawnNext: true,
          },
        ]
  })

  // ---LOCAL STORAGE SYNC---
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards))
  }, [cards])

  const handleFlip = useCallback((cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId && !card.text
          ? { ...card, isFlipped: true, isEditing: true, shouldSpawnNext: true }
          : card
      )
    )
  }, [])

  // ---CARDS LOGIC---
  const handleInputChange = (cardId, value) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, text: value } : card
      )
    )
  }

  const handleSubmit = (cardId, event) => {
    event.preventDefault()
    event.stopPropagation()
    handleSaveCard(cardId)
  }

  const handleIncrementCounter = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, count: card.count + 1 } : card
      )
    )
  }

  const handleSaveCard = (cardId) => {
    setCards((prevCards) => {
      const current = prevCards.find((card) => card.id === cardId)
      if (!current?.text?.trim()) return prevCards

      const spawnNext = !!current.shouldSpawnNext

      const updated = prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              text: card.text.toUpperCase(),
              isEditing: false,
              shouldSpawnNext: false,
            }
          : card
      )

      if (spawnNext) {
        updated.push({
          id: Date.now(),
          text: '',
          count: 0,
          isFlipped: false,
          isEditing: true,
          shouldSpawnNext: true,
        })
      }

      return updated
    })
  }

  // ---CARD MENU LOGIC---
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleOpenMenu = (cardId, isEditing, ref) => {
    if (isEditing) return
    clearTimer()
    timerRef.current = setTimeout(() => {
      const rect = ref.current?.getBoundingClientRect() || null
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, showMenu: true, menuPosition: rect }
            : card
        )
      )
    }, 400)
  }

  //Закрытие меню при нажатии на кнопку X и при нажатии на любую часть экрана
  const handleCloseMenu = (cardId) => {
    clearTimer()

    // Если первый аргумент — это событие (а не число), игнорируем его
    if (cardId && typeof cardId !== 'number') {
      cardId = undefined
    }

    if (cardId == null) {
      // Закрыть все меню
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, showMenu: false }))
      )
    } else {
      // Закрыть только одно меню
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, showMenu: false } : card
        )
      )
    }
  }

  const handleDeleteCard = (cardId) => {
    const confirmDelete = confirm('Ты точно хочешь удалить эту карточку?')
    if (!confirmDelete) return

    // Сначала плавно закрываем меню
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, showMenu: false } : card
      )
    )

    // Даём Framer Motion время проиграть exit
    setTimeout(() => {
      setCards((prev) => prev.filter((card) => card.id !== cardId))
    }, 50) // 0.25s = duration твоей анимации
  }

  const handleRenameCard = (cardId) => {
    clearTimer()
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              isEditing: true,
              shouldSpawnNext: false,
              showMenu: false,
            }
          : card
      )
    )
  }

  const handleMouseUp = () => clearTimer()

  // ---EXPORT---
  return {
    cards,
    handleFlip,
    handleInputChange,
    handleSubmit,
    handleIncrementCounter,

    handleOpenMenu,
    handleCloseMenu,
    handleDeleteCard,
    handleRenameCard,
    handleMouseUp,
  }
}

export default useCards
