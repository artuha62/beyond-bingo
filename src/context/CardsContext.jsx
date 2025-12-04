import { createContext, useMemo } from 'react'
import useCards from '@/hooks/useCards.js'
import { useAuth } from '@/hooks/useAuth.js'
import useCardMenu from '@/hooks/useCardMenu.js'

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
    handleFlip,
    handleSaveText,
    handleDeleteAllCards,
    handleIncrementCounter,
    handleDeleteCard,
    handleRenameCard,
    handleResetCounter,
    showSkeleton,
  } = useCards(user?.id)

  const { menu, handleOpenMenu, handleCloseMenu } = useCardMenu()

  const cardsValue = useMemo(() => {
    return { cards, showSkeleton }
  }, [cards, showSkeleton])

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
