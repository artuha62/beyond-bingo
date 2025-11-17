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
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId && !card.text
          ? { ...card, isFlipped: true, isEditing: true }
          : card
      )
    )
  }, [])

  const handleInputChange = useCallback((cardId, value) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, text: value } : card
      )
    )
  }, [])

  const handleIncrementCounter = useCallback((cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, count: card.count + 1 } : card
      )
    )
  }, [])

  const handleSaveCard = useCallback((cardId) => {
    setCards((prevCards) => {
      const current = prevCards.find((card) => card.id === cardId)
      if (!current?.text?.trim()) return prevCards

      const isLastCard = prevCards[prevCards.length - 1]?.id === cardId

      const updatedCard = prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              text: card.text.toUpperCase(),
              isEditing: false,
            }
          : card
      )

      if (isLastCard && prevCards.length < 16) {
        updatedCard.push({
          id: Date.now(),
          text: '',
          count: 0,
          isFlipped: false,
          isEditing: true,
        })
      }

      return updatedCard
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

        const menuWidth = 289
        const menuHeight = 79

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

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isRemoving: true } : card
      )
    )

    setTimeout(() => {
      setCards((prevCards) => {
        const filtered = prevCards.filter((card) => card.id !== cardId)

        const lastCard = filtered[filtered.length - 1]
        const needsNewCard = filtered.length < 16 && lastCard?.text

        if (needsNewCard) {
          filtered.push({
            id: Date.now(),
            text: '',
            count: 0,
            isFlipped: false,
            isEditing: true,
          })
        }
        return filtered
      })
    }, 250)
  }, [])

  const handleRenameCard = useCallback(
    (cardId) => {
      clearTimer()
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                isEditing: true,
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

  const handleResetCounter = useCallback((cardId) => {
    setMenu({
      openCardId: null,
      position: null,
    })

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, count: 0 } : card
      )
    )
  }, [])

  const handleMouseUp = useCallback(() => {
    clearTimer()
  }, [clearTimer])

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
    handleResetCounter,
    handleMouseUp,
  }
}

export default useCards
