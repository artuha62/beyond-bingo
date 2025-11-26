import { useCallback, useEffect, useRef, useState } from 'react'
import cardsAPI from '../api/cardsAPI.js'

const MAX_CARDS = 16

const useCards = (userId) => {
  console.log('🔥 useCards invoked with userId:', userId)

  const timerRef = useRef(null)
  const syncRef = useRef({})
  const hasLoaded = useRef(false)

  // --- STATE ---
  const [cards, setCards] = useState([])
  const [menu, setMenu] = useState({
    openCardId: null,
    position: null,
  })

  console.log('📦 useCards state', { cards, menu })

  // --- INITIAL LOAD ---
  useEffect(() => {
    console.log('⚡ useEffect INITIAL LOAD fired, userId =', userId)

    if (!userId) {
      console.log('⛔ userId отсутствует → прерываю загрузку')
      return
    }
    if (hasLoaded.current) {
      console.log('⛔ уже загружено → прерываю')
      return
    }
    hasLoaded.current = true

    const loadCards = async () => {
      console.log('📥 loadCards() START')

      let nextCards = []

      try {
        const cardsData = await cardsAPI.getAll(userId)
        console.log('📄 cardsAPI.getAll →', cardsData)

        if (!cardsData || cardsData.length === 0) {
          console.log('🆕 нет карточек → создаю новую')
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
          console.log('📄 Загружены существующие карточки →', cardsData.length)
          nextCards = cardsData.map((card) => ({
            ...card,
            isFlipped: !!card.text,
            isEditing: false,
            isRemoving: false,
          }))
        }
      } catch (error) {
        console.log('💥 Load cards error:', error)
        alert('Ошибка сервера. Попробуйте ещё раз.')
        return null
      }

      console.log('📤 setCards(nextCards)')
      setCards(nextCards)
    }

    loadCards()
  }, [userId])

  // --- HELPERS ---
  const clearTimer = useCallback(() => {
    console.log('🧹 clearTimer() called')
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // --- MENU LOGIC ---
  const handleOpenMenu = useCallback(
    (cardId, ref) => {
      console.log('📌 handleOpenMenu(cardId):', cardId)

      clearTimer()

      timerRef.current = setTimeout(() => {
        console.log('⏳ MENU OPEN timeout finished for card', cardId)

        const rect = ref.current?.getBoundingClientRect()
        console.log('📐 rect =', rect)
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

        console.log('📌 MENU SET →', {
          openCardId: cardId,
        })
      }, 500)
    },
    [clearTimer]
  )

  const handleCloseMenu = useCallback(() => {
    console.log('📌 handleCloseMenu() called')
    clearTimer()
    setMenu({ openCardId: null, position: null })
  }, [clearTimer])

  const handleMouseUp = useCallback(() => {
    console.log('🖱 handleMouseUp() called')
    clearTimer()
  }, [clearTimer])

  // --- CARD LOGIC ---
  const createNewCard = useCallback(async () => {
    console.log('🆕 createNewCard()')

    try {
      const createdCard = await cardsAPI.create(userId)
      console.log('📤 cardsAPI.create →', createdCard)

      const newCard = {
        ...createdCard,
        isFlipped: false,
        isEditing: false,
        isRemoving: false,
      }

      setCards((prev) => {
        console.log('📥 setCards([...prev, newCard])')
        return [...prev, newCard]
      })

      return newCard
    } catch (error) {
      console.log('💥 Create card error:', error)
      alert('Ошибка сервера. Попробуйте ещё раз.')
    }
  }, [userId])

  const updateCard = useCallback(async (cardId, updates) => {
    console.log('✏ updateCard(cardId, updates):', cardId, updates)

    setCards((prevCards) => {
      console.log('📥 setCards inside updateCard')
      return prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    })

    try {
      await cardsAPI.update(cardId, updates)
      console.log('📤 cardsAPI.update success')
    } catch (error) {
      console.log('💥 Update card error:', error)
      alert('Ошибка сервера. Попробуйте ещё раз.')
    }
  }, [])

  // FLIP
  const handleFlip = useCallback((cardId) => {
    console.log('🔄 handleFlip(cardId):', cardId)

    setCards((prevCards) => {
      console.log('📥 updating flip...')
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
      console.log('💾 handleSaveText(cardId, newText):', cardId, newText)

      if (!newText.trim()) {
        console.log('⛔ пустой текст — прекращаю')
        return
      }

      const upper = newText.toUpperCase()

      let shouldCreateNew = false

      setCards((prev) => {
        console.log('📥 setCards inside handleSaveText')
        const updated = prev.map((card) =>
          card.id === cardId ? { ...card, text: upper, isEditing: false } : card
        )

        const last = updated[updated.length - 1]
        shouldCreateNew = updated.length < MAX_CARDS && !!last?.text

        console.log('🧮 shouldCreateNew =', shouldCreateNew)

        return updated
      })

      await updateCard(cardId, { text: upper })

      if (shouldCreateNew) {
        console.log('🆕 Creating new card after saveText')
        await createNewCard()
      }
    },
    [updateCard, createNewCard]
  )

  // RENAME
  const handleRenameCard = useCallback((cardId) => {
    console.log('✏ handleRenameCard(cardId):', cardId)

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isEditing: true } : card
      )
    )
  }, [])

  // DELETE ALL
  const handleDeleteAllCards = useCallback(async () => {
    console.log('🗑 handleDeleteAllCards()')

    const confirmDeleteAll = confirm('Удалить все карточки?')
    if (!confirmDeleteAll) {
      console.log('⛔ отмена удаления всех')
      return
    }

    let previousCards

    setCards((prevCards) => {
      console.log('📥 setCards → очищаю все карточки')
      previousCards = prevCards
      return []
    })

    try {
      await cardsAPI.deleteAll(userId)
      console.log('📤 cardsAPI.deleteAll success')

      await createNewCard()
    } catch (error) {
      console.log('💥 Delete all error:', error)
      alert('Ошибка сервера. Попробуйте ещё раз.')
      setCards(previousCards)
    }
  }, [userId, createNewCard])

  // DELETE ONE
  const handleDeleteCard = useCallback(
    async (cardId) => {
      console.log('🗑 handleDeleteCard(cardId):', cardId)

      const confirmDelete = confirm('Ты точно хочешь удалить эту карточку?')
      if (!confirmDelete) {
        console.log('⛔ отмена удаления одной')
        return
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isRemoving: true } : card
        )
      )

      setTimeout(async () => {
        console.log('⏳ handleDeleteCard timeout finished')

        try {
          let needsNewCard = false

          setCards((prevCards) => {
            console.log('📥 deleting card in setTimeout')
            const filtered = prevCards.filter((card) => card.id !== cardId)
            const lastCard = filtered[filtered.length - 1]
            needsNewCard = filtered.length < MAX_CARDS && !!lastCard?.text
            return filtered
          })

          await cardsAPI.delete(cardId)

          if (needsNewCard) {
            console.log('🆕 Creating new after delete')
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
    console.log('➕ handleIncrementCounter(cardId):', cardId)

    setCards((prevCards) => {
      console.log('📥 incrementing counter...')
      const updated = prevCards.map((card) =>
        card.id === cardId ? { ...card, count: card.count + 1 } : card
      )

      const newCount = updated.find((c) => c.id === cardId).count
      console.log('🔢 newCount =', newCount)

      if (syncRef.current[cardId]) {
        console.log('🧹 clearing syncRef timeout')
        clearTimeout(syncRef.current[cardId])
      }

      syncRef.current[cardId] = setTimeout(async () => {
        console.log('⏳ syncing counter to server...')

        try {
          await cardsAPI.update(cardId, { count: newCount })
          console.log('📤 server sync success')
        } catch (error) {
          console.log('💥 Update counter error:', error)
        }

        delete syncRef.current[cardId]
      }, 500)

      return updated
    })
  }, [])

  const handleResetCounter = useCallback(
    async (cardId) => {
      console.log('🔄 handleResetCounter(cardId):', cardId)

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
