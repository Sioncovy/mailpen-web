import { Button, ButtonProps } from 'antd'
import React from 'react'
import styles from './index.module.less'

interface TextButtonProps extends ButtonProps {
  children?: React.ReactNode
}

const TextButton = ({ children, ...props }: TextButtonProps) => {
  return (
    <Button {...props} type="link" className={styles.button}>
      {children}
    </Button>
  )
}

export default TextButton
