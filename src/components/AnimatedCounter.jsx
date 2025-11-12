import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

const AnimatedCounter = ({ value }) => {
  const [prev, setPrev] = useState(value)

  useEffect(() => {
    if (value !== prev) setPrev(value)
  }, [value])

  return (
    <div className="counter-body">
      <div>x</div>
      <motion.div
        key={value}
        initial={{ y: '120%', opacity: 0.8 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-120%', opacity: 0.8 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {value}
      </motion.div>
    </div>
  )
}

export default AnimatedCounter
