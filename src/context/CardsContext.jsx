import { createContext, useMemo } from 'react'
import useCards from '../hooks/useCards.js'
import { useAuth } from '../hooks/useAuth.js'

// eslint-disable-next-line react-refresh/only-export-components
export const CardsDataContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const ActionsContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const MenuDataContext = createContext(null)

export const CardsProvider = ({ children }) => {
  const { user } = useAuth()

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
  } = useCards(user?.id)

  const cardsValue = useMemo(() => {
    return { cards }
  }, [cards])

  const menuValue = useMemo(() => {
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
