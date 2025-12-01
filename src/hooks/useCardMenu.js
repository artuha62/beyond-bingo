import { useCallback, useState } from 'react'

const useCardMenu = () => {
  const [menu, setMenu] = useState({
    openCardId: null,
    cardPosition: null,
  })

  const handleOpenMenu = useCallback((cardId, ref) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    setMenu({
      openCardId: cardId,
      cardPosition: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
    })
  }, [])

  const handleCloseMenu = useCallback(() => {
    setMenu({ openCardId: null, cardPosition: null })
  }, [])

  return {
    menu,
    handleOpenMenu,
    handleCloseMenu,
  }
}

export default useCardMenu
