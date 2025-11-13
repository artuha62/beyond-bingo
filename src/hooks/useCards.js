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

  const [menu, setMenu] = useState({
    openCardId: null,
    position: null,
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
        const rect = ref.current?.getBoundingClientRect()

        const menuWidth = 220
        const menuHeight = 74

        if (!rect) return

        setMenu({
          openCardId: cardId,
          position: {
            x: rect.left + (rect.width - menuWidth) / 2,
            y: rect.top + (rect.height - menuHeight) / 2,
          },
        })
      }, 400)
    },
    [clearTimer]
  )

  const handleCloseMenu = useCallback(() => {
    clearTimer()
    setMenu({
      openCardId: null,
      position: null,
    })
  }, [clearTimer])

  const handleDeleteCard = useCallback((cardId) => {
    const confirmDelete = confirm('Ты точно хочешь удалить эту карточку?')
    if (!confirmDelete) return

    setMenu({
      openCardId: null,
      position: null,
    })

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isRemoving: true } : card
      )
    )

    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== cardId))
    }, 250)
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
              }
            : card
        )
      )
      setMenu({
        openCardId: null,
        position: null,
      })
    },
    [clearTimer]
  )

  const handleMouseUp = useCallback(() => {
    clearTimer()
  }, [clearTimer])

  // ---EXPORT---
  return {
    cards,
    menu,
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
