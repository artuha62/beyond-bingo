import { useCallback, useEffect, useRef, useState } from 'react'

const useCards = () => {
  const initialCards = [
    {
      id: 1,
      text: 'ПУТИН ЗАПУСТИЛ КАРТОШКУ В КОСМОС',
      count: 5,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 2,
      text: 'ТРАМП СПОРИТ С ГОЛУБЕМ',
      count: 2,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 3,
      text: 'МАСК ПРОДАЛ ПРАВДУ ЗА $8',
      count: 7,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 4,
      text: 'ВАЛАКАС СТАЛ ПРЕЗИДЕНТОМ ПОДЪЕЗДА',
      count: 9,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 5,
      text: 'ПУТИН ИЩЕТ ВКУСНУЮ СЕЛЁДКУ',
      count: 1,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 6,
      text: 'ТРАМП ПОСТРОИЛ ДИВАН',
      count: 4,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 7,
      text: 'МАСК ПОКУПАЕТ ТОРТЫ',
      count: 6,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 8,
      text: 'ВАЛАКАС ВЁЛ САММИТ В МАЙНКРАФТЕ',
      count: 3,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 9,
      text: 'ПУТИН ПОДПИСАЛ КОТА',
      count: 12,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 10,
      text: 'ТРАМП СЛОМАЛ ЛЕДЕНЕЦ',
      count: 8,
      isFlipped: true,
      isEditing: false,
    },

    {
      id: 11,
      text: 'МАСК ИЗОБРЁЛ САМОГРЯЗНУЮ ЛОЖКУ',
      count: 11,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 12,
      text: 'ВАЛАКАС ПРОВЁЛ ДЕБАТЫ С ЛОСЕМ',
      count: 5,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 13,
      text: 'ПУТИН ИГРАЕТ НА БАЗУКЕ',
      count: 7,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 14,
      text: 'ТРАМП ЗАПУТАЛСЯ В ШАРФЕ',
      count: 2,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 15,
      text: 'МАСК КУПИЛ СЛУЧАЙНЫЙ МАГАЗИН',
      count: 9,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 16,
      text: 'ВАЛАКАС ОТКРЫЛ ПАРТИЮ ГИПЕРБОРОВ',
      count: 4,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 17,
      text: 'ПУТИН ПОТЕРЯЛ ПУЛЬТ',
      count: 3,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 18,
      text: 'ТРАМП РУГАЕТСЯ С ТУМБОЙ',
      count: 6,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: 19,
      text: 'МАСК ПОСТРОИЛ РАКЕТУ ИЗ ПАКЕТОВ',
      count: 10,
      isFlipped: true,
      isEditing: false,
    },
    {
      id: Date.now(),
      text: '',
      count: 0,
      isFlipped: false,
      isEditing: true,
    },
  ]

  const timerRef = useRef(null)

  // ---STATE---
  // const [cards, setCards] = useState(() => {
  //   const saved = localStorage.getItem('cards')
  //   return saved
  //     ? JSON.parse(saved)
  //     : [
  //         {
  //           id: Date.now(),
  //           text: '',
  //           count: 0,
  //           isFlipped: false,
  //           isEditing: true,
  //         },
  //       ]
  // })

  const [cards, setCards] = useState(initialCards)

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

      if (isLastCard && prevCards.length < 20) {
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

        const menuWidth = 220
        const menuHeight = 64

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
        const needsNewCard = filtered.length < 20 && lastCard?.text

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
    handleResetCounter,
    handleMouseUp,
  }
}

export default useCards
