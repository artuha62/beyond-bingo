import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth.js'
import cardsAPI from '../api/cardsAPI.js'

const MAX_CARDS = 16

const useCards = () => {
  const { user } = useAuth()
  const timerRef = useRef(null)
  const syncRef = useRef({})
  const hasLoaded = useRef(false)

  // --- STATE ---
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  const [menu, setMenu] = useState({
    openCardId: null,
    position: null,
  })

  useEffect(() => {
    if (!user) return

    if (hasLoaded.current) {
      return
    }
    hasLoaded.current = true

    const loadCards = async () => {
      setLoading(true)

      let cardsData = []

      try {
        cardsData = await cardsAPI.getAll(user.id)
      } catch (error) {
        console.log('Load cards error:', error)
        return
      }

      if (!cardsData || cardsData.length === 0) {
        let newCard

        try {
          newCard = await cardsAPI.create(user.id)
        } catch (error) {
          console.log('Create card error:', error)
          return
        }

        setCards([
          {
            ...newCard,
            isFlipped: false,
            isEditing: true,
            isRemoving: false,
          },
        ])

        setLoading(false)
        return
      }

      setCards(
        cardsData.map((card) => ({
          ...card,
          isFlipped: false,
          isEditing: false,
          isRemoving: false,
        }))
      )

      setLoading(false)
    }

    loadCards()
  }, [user])

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
    let createdCard

    try {
      createdCard = await cardsAPI.create(user.id)
    } catch (error) {
      console.log('Create card error:', error)
      return
    }

    const newCard = {
      ...createdCard,
      isFlipped: false,
      isEditing: true,
      isRemoving: false,
    }

    setCards((prevCard) => [...prevCard, newCard])
    return newCard
  }, [user])

  // --- CARDS LOGIC ---

  const handleFlip = useCallback((cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
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

  const handleIncrementCounter = useCallback(
    (cardId) => {
      setCards((prevCards) => {
        const updated = prevCards.map((card) =>
          card.id === cardId ? { ...card, count: card.count + 1 } : card
        )

        const newCount = updated.find((c) => c.id === cardId).count

        if (syncRef.current[cardId]) {
          clearTimeout(syncRef.current[cardId])
        }

        syncRef.current[cardId] = setTimeout(() => {
          updateCard(cardId, { count: newCount })

          delete syncRef.current[cardId]
        }, 500)

        return updated
      })
    },
    [updateCard]
  )

  const handleSaveCard = useCallback(
    async (cardId) => {
      const currentCard = cards.find((card) => card.id === cardId)
      if (!currentCard?.text.trim()) return

      const upperText = currentCard.text.toUpperCase()

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, text: upperText, isEditing: false }
            : card
        )
      )

      await updateCard(cardId, { text: upperText })

      const lastCard = cards[cards.length - 1]
      const needNewCard = cards.length < MAX_CARDS && lastCard?.text

      if (needNewCard) {
        updateCard(cardId, { text: upperText })
        createNewCard()
      }
    },
    [cards, updateCard, createNewCard]
  )

  const handleSubmit = useCallback(
    async (cardId, event) => {
      event.preventDefault()
      event.stopPropagation()
      await handleSaveCard(cardId)
    },
    [handleSaveCard]
  )

  // --- MENU LOGIC ---
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

      updateCard(cardId, { count: 0 })
    },
    [handleCloseMenu, updateCard]
  )

  const handleMouseUp = useCallback(() => {
    clearTimer()
  }, [clearTimer])

  return {
    cards,
    loading,
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
