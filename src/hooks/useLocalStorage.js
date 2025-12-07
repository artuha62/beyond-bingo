import { useEffect, useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log('useLocalStorage: parse error', error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log('useLocalStorage: set error', error)
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
