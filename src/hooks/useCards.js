import { useCallback, useEffect, useRef, useState } from 'react'
import cardsAPI from '../api/cardsAPI.js'

const MAX_CARDS = 16

const useCards = (userId) => {
  const timerRef = useRef(null)
  const syncRef = useRef({})
  const hasLoaded = useRef(false)

  // --- STATE ---
  const [cards, setCards] = useState([])

  const [menu, setMenu] = useState({
    openCardId: null,
    position: null,
  })

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (!userId) return
    if (hasLoaded.current) return
    hasLoaded.current = true

    const loadCards = async () => {
      let nextCards = []

      try {
        const cardsData = await cardsAPI.getAll(userId)

        if (!cardsData || cardsData.length === 0) {
          const newCard = await cardsAPI.create(userId)

          nextCards = [
            {
              ...newCard,
              isFlipped: false,
              isEditing: false,
              isRemoving: false,
            },
          ]
        } else {
          nextCards = cardsData.map((card) => ({
            ...card,
            isFlipped: !!card.text,
            isEditing: false,
            isRemoving: false,
          }))
        }
      } catch (error) {
        console.log('Load cards error:', error)
        return
      }

      setCards(nextCards)
    }

    loadCards()
  }, [userId])

  // --- HELPERS ---
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const updateCard = useCallback(async (cardId, updates) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    )

    try {
      await cardsAPI.update(cardId, updates)
    } catch (error) {
      console.log('Update card error:', error)
    }
  }, [])

  const createNewCard = useCallback(async () => {
    try {
      const createdCard = await cardsAPI.create(userId)

      const newCard = {
        ...createdCard,
        isFlipped: false,
        isEditing: false,
        isRemoving: false,
      }

      setCards((prev) => [...prev, newCard])
      return newCard
    } catch (error) {
      console.log('Create card error:', error)
    }
  }, [userId])

  // --- CARD LOGIC ---
  const handleFlip = useCallback((cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, isFlipped: true, isEditing: true }
          : card
      )
    )
  }, [])

  const handleIncrementCounter = useCallback((cardId) => {
    setCards((prevCards) => {
      const updated = prevCards.map((card) =>
        card.id === cardId ? { ...card, count: card.count + 1 } : card
      )

      const newCount = updated.find((c) => c.id === cardId).count

      if (syncRef.current[cardId]) {
        clearTimeout(syncRef.current[cardId])
      }

      syncRef.current[cardId] = setTimeout(async () => {
        try {
          await cardsAPI.update(cardId, { count: newCount })
        } catch (error) {
          console.log('Update card error:', error)
        }
        delete syncRef.current[cardId]
      }, 500)

      return updated
    })
  }, [])

  const handleSaveText = useCallback(
    async (cardId, newText) => {
      if (!newText.trim()) return

      const upper = newText.toUpperCase()

      setCards((prev) => {
        const updated = prev.map((card) =>
          card.id === cardId ? { ...card, text: upper, isEditing: false } : card
        )

        const last = updated[updated.length - 1]

        if (updated.length < MAX_CARDS && last?.text) {
          createNewCard()
        }

        return updated
      })

      updateCard(cardId, { text: upper })
    },
    [updateCard, createNewCard]
  )

  const handleDeleteAllCards = useCallback(async () => {
    const confirmDeleteAll = confirm('Удалить все карточки?')
    if (!confirmDeleteAll) return

    setCards([])

    try {
      await cardsAPI.deleteAll(userId)
      await createNewCard()
    } catch (error) {
      console.log('Delete all cards error:', error)
    }
  }, [userId, createNewCard])

  // --- MENU LOGIC ---
  const handleOpenMenu = useCallback(
    (cardId, isEditing, ref) => {
      if (isEditing) return

      clearTimer()

      timerRef.current = setTimeout(() => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return

        const menuWidth = 289
        const menuHeight = 79

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
    setMenu({ openCardId: null, position: null })
  }, [clearTimer])

  const handleDeleteCard = useCallback(
    async (cardId) => {
      const confirmDelete = confirm('Ты точно хочешь удалить эту карточку?')
      if (!confirmDelete) return

      handleCloseMenu()

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isRemoving: true } : card
        )
      )

      setTimeout(async () => {
        try {
          setCards((prevCards) => {
            const filtered = prevCards.filter((card) => card.id !== cardId)

            const lastCard = filtered[filtered.length - 1]
            const needsNewCard = filtered.length < MAX_CARDS && lastCard?.text

            if (needsNewCard) {
              createNewCard()
            }

            return filtered
          })

          await cardsAPI.delete(cardId)
        } catch (error) {
          console.error('Delete card error:', error)
        }
      }, 300)
    },
    [handleCloseMenu, createNewCard]
  )

  const handleRenameCard = useCallback(
    (cardId) => {
      clearTimer()
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isEditing: true } : card
        )
      )
      handleCloseMenu()
    },
    [clearTimer, handleCloseMenu]
  )

  const handleResetCounter = useCallback(
    (cardId) => {
      handleCloseMenu()

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, count: 0 } : card
        )
      )

      cardsAPI.update(cardId, { count: 0 }).catch((error) => {
        console.log('Update card error:', error)
      })
    },
    [handleCloseMenu]
  )

  const handleMouseUp = useCallback(() => {
    clearTimer()
  }, [clearTimer])

  return {
    cards,
    menu,
    handleFlip,
    handleSaveText,
    handleDeleteAllCards,
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
