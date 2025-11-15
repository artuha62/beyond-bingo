import { createContext } from 'react'
import useCards from '../hooks/useCards.js'

// eslint-disable-next-line react-refresh/only-export-components
export const CardsContext = createContext({})

export const CardsProvider = (props) => {
  const { children } = props

  const {
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
  } = useCards()

  return (
    <CardsContext.Provider
      value={{
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
      }}
    >
      {children}
    </CardsContext.Provider>
  )
}
