import { useCallback, useEffect, useRef, useState } from 'react'
import cardsAPI from '../api/cardsAPI.js'

const MAX_CARDS = 16

const useCards = (userId) => {
  const syncRef = useRef({})
  const hasLoaded = useRef(false)

  // --- STATES ---
  const [cards, setCards] = useState([])
  const [showSkeleton, setShowSkeleton] = useState(true)

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (!userId) return
    if (hasLoaded.current) return
    hasLoaded.current = true

    const loadCards = async () => {
      setShowSkeleton(true)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      try {
        const cardsData = await cardsAPI.getAll(userId)

        let nextCards = []

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

        setCards(nextCards)
      } catch (error) {
        console.log('Load cards error:', error)
        alert('Ошибка сервера. Попробуйте ещё раз.')
        return null
      } finally {
        setShowSkeleton(false)
      }
    }

    loadCards()
  }, [userId])

  // --- CARD LOGIC ---
  const createNewCard = useCallback(async () => {
    try {
      const createdCard = await cardsAPI.create(userId)

      const newCard = {
        ...createdCard,
        isFlipped: false,
        isEditing: false,
        isRemoving: false,
      }

      setCards((prev) => {
        return [...prev, newCard]
      })

      return newCard
    } catch (error) {
      console.log('Create card error:', error)
      alert('Ошибка сервера. Попробуйте ещё раз.')
    }
  }, [userId])

  const updateCard = useCallback(async (cardId, updates) => {
    setCards((prevCards) => {
      return prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    })

    try {
      await cardsAPI.update(cardId, updates)
    } catch (error) {
      console.log('Update card error:', error)
      alert('Ошибка сервера. Попробуйте ещё раз.')
    }
  }, [])

  // FLIP
  const handleFlip = useCallback((cardId) => {
    setCards((prevCards) => {
      return prevCards.map((card) =>
        card.id === cardId
          ? { ...card, isFlipped: true, isEditing: true }
          : card
      )
    })
  }, [])

  // SAVE TEXT
  const handleSaveText = useCallback(
    async (cardId, newText) => {
      if (!newText.trim()) {
        return
      }

      const upper = newText.toUpperCase()

      let shouldCreateNew = false

      setCards((prev) => {
        const updated = prev.map((card) =>
          card.id === cardId ? { ...card, text: upper, isEditing: false } : card
        )

        const last = updated[updated.length - 1]
        shouldCreateNew = updated.length < MAX_CARDS && !!last?.text

        return updated
      })

      await updateCard(cardId, { text: upper })

      if (shouldCreateNew) {
        await createNewCard()
      }
    },
    [updateCard, createNewCard]
  )

  // RENAME
  const handleRenameCard = useCallback((cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isEditing: true } : card
      )
    )
  }, [])

  // DELETE ALL
  const handleDeleteAllCards = useCallback(async () => {
    const confirmDeleteAll = confirm('Удалить все карточки?')
    if (!confirmDeleteAll) {
      return
    }

    let previousCards

    setCards((prevCards) => {
      previousCards = prevCards
      return []
    })

    try {
      await cardsAPI.deleteAll(userId)
      await createNewCard()
    } catch (error) {
      console.log('Delete all error:', error)
      alert('Ошибка сервера. Попробуйте ещё раз.')
      setCards(previousCards)
    }
  }, [userId, createNewCard])

  // DELETE ONE
  const handleDeleteCard = useCallback(
    async (cardId) => {
      const confirmDelete = confirm('Ты точно хочешь удалить эту карточку?')
      if (!confirmDelete) {
        return
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isRemoving: true } : card
        )
      )

      setTimeout(async () => {
        try {
          let needsNewCard = false

          setCards((prevCards) => {
            const filtered = prevCards.filter((card) => card.id !== cardId)
            const lastCard = filtered[filtered.length - 1]
            needsNewCard = filtered.length < MAX_CARDS && !!lastCard?.text
            return filtered
          })

          await cardsAPI.delete(cardId)

          if (needsNewCard) {
            await createNewCard()
          }
        } catch (error) {
          console.error('Delete card error:', error)
          alert('Ошибка сервера. Попробуйте ещё раз.')
        }
      }, 300)
    },
    [createNewCard]
  )

  // COUNTER
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
          console.log('Update counter error:', error)
        }
        delete syncRef.current[cardId]
      }, 500)

      return updated
    })
  }, [])

  const handleResetCounter = useCallback(
    async (cardId) => {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, count: 0 } : card
        )
      )

      await updateCard(cardId, { count: 0 })
    },
    [updateCard]
  )

  return {
    cards,
    handleFlip,
    handleSaveText,
    handleDeleteAllCards,
    handleIncrementCounter,
    handleDeleteCard,
    handleRenameCard,
    handleResetCounter,
    showSkeleton,
  }
}

export default useCards
