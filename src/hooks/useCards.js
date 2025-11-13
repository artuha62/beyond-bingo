import { useCallback, useEffect, useRef, useState } from 'react'

const useCards = () => {
  const timerRef = useRef(null)

  // ---STATE---
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cards')
    return saved
      ? JSON.parse(saved)
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

  // ---HELPERS---
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // ---CARDS LOGIC---

  const handleFlip = useCallback((cardId) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId && !card.text
          ? { ...card, isFlipped: true, isEditing: true, shouldSpawnNext: true }
          : card
      )
    )
  }, [])

  const handleInputChange = useCallback((cardId, value) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, text: value } : card))
    )
  }, [])

  const handleIncrementCounter = useCallback((cardId) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, count: card.count + 1 } : card
      )
    )
  }, [])

  const handleSaveCard = useCallback((cardId) => {
    setCards((prev) => {
      const current = prev.find((c) => c.id === cardId)
      if (!current?.text?.trim()) return prev

      const spawnNext = current.shouldSpawnNext

      const updated = prev.map((card) =>
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
  }, [])

  const handleSubmit = useCallback(
    (cardId, event) => {
      event.preventDefault()
      event.stopPropagation()
      handleSaveCard(cardId)
    },
    [handleSaveCard]
  )

  // ---MENU LOGIC---

  const handleOpenMenu = useCallback(
    (cardId, isEditing, ref) => {
      if (isEditing) return

      clearTimer()

      timerRef.current = setTimeout(() => {
        const rect = ref.current?.getBoundingClientRect() || null
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId
              ? { ...card, showMenu: true, menuPosition: rect }
              : card
          )
        )
      }, 400)
    },
    [clearTimer]
  )

  const handleCloseMenu = useCallback(
    (cardId) => {
      clearTimer()

      // Если cardId = MouseEvent → игнорируем
      if (cardId && typeof cardId !== 'number') {
        cardId = undefined
      }

      setCards((prev) =>
        prev.map((card) =>
          cardId == null
            ? { ...card, showMenu: false }
            : card.id === cardId
              ? { ...card, showMenu: false }
              : card
        )
      )
    },
    [clearTimer]
  )

  const handleDeleteCard = useCallback((cardId) => {
    const confirmDelete = confirm('Ты точно хочешь удалить эту карточку?')
    if (!confirmDelete) return

    // закрываем меню
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, showMenu: false } : c))
    )

    // удаляем карту с небольшой задержкой
    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== cardId))
    }, 50)
  }, [])

  const handleRenameCard = useCallback(
    (cardId) => {
      clearTimer()
      setCards((prev) =>
        prev.map((card) =>
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
    },
    [clearTimer]
  )

  const handleMouseUp = useCallback(() => {
    clearTimer()
  }, [clearTimer])

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
