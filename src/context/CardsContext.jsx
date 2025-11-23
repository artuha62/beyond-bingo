import { createContext, useMemo } from 'react'
import useCards from '../hooks/useCards.js'

// eslint-disable-next-line react-refresh/only-export-components
export const CardsDataContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const ActionsContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const MenuDataContext = createContext(null)

export const CardsProvider = ({ userId, children }) => {
  console.log('CardsProvider RENDER')
  const {
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
  } = useCards(userId)

  const cardsValue = useMemo(() => {
    console.log('-> cardsValue пересоздан, карточек:', cards.length)
    return { cards }
  }, [cards])

  const menuValue = useMemo(() => {
    console.log(
      '-> menuValue пересоздан, ID открытой карточки:',
      menu.openCardId
    )
    return { menu }
  }, [menu])

  const actionsValue = useMemo(() => {
    return {
      handleFlip,
      handleSaveText,
      handleDeleteAllCards,
      handleIncrementCounter,
      handleDeleteCard,
      handleRenameCard,
      handleResetCounter,

      handleOpenMenu,
      handleCloseMenu,
      handleMouseUp,
    }
  }, [
    handleFlip,
    handleSaveText,
    handleDeleteAllCards,
    handleIncrementCounter,
    handleDeleteCard,
    handleRenameCard,
    handleResetCounter,

    handleOpenMenu,
    handleCloseMenu,
    handleMouseUp,
  ])

  return (
    <CardsDataContext.Provider value={cardsValue}>
      <ActionsContext.Provider value={actionsValue}>
        <MenuDataContext.Provider value={menuValue}>
          {children}
        </MenuDataContext.Provider>
      </ActionsContext.Provider>
    </CardsDataContext.Provider>
  )
}
