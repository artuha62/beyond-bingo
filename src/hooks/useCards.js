import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase.js'
import { useAuth } from './useAuth.js'

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

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) return

      if (!data || data.length === 0) {
        const { data: newCards, error: insertError } = await supabase
          .from('cards')
          .insert({
            user_id: user.id,
            text: '',
            count: 0,
          })
          .select()

        if (insertError) return

        setCards(
          newCards.map((card) => ({
            ...card,
            isFlipped: false,
            isEditing: true,
            isRemoving: false,
          }))
        )

        setLoading(false)
        return
      }

      setCards(
        data.map((card) => ({
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
    const { error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', cardId)

    if (error) {
      console.error(error)
      return
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    )
  }, [])

  const createNewCard = useCallback(async () => {
    const { data, error } = await supabase
      .from('cards')
      .insert({
        user_id: user.id,
        text: '',
        count: 0,
      })
      .select()

    if (error) {
      console.error(error)
      return null
    }

    const newCard = {
      ...data[0],
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

        const current = updated.find((card) => card.id === cardId)

        if (syncRef.current[cardId]) {
          clearTimeout(syncRef.current[cardId])
        }

        syncRef.current[cardId] = setTimeout(() => {
          updateCard(cardId, { count: current.count })
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
          await supabase.from('cards').delete().eq('id', cardId)
        } catch (error) {
          console.error('Error deleting card:', error)
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
