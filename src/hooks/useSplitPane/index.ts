import { useRef, useState } from 'react'
import type { Split, SplitPaneProps } from 'react-split-pane'
import { useLocalStorage } from 'react-use'
import './index.less'

interface UseSplitPaneProps {
  /** 初始尺寸 */
  defaultSize?: number
  /** 自动最小化的最小尺寸 */
  defaultMinSize?: number
  /** 可拖动且不触发自动最小化的最小尺寸 */
  dragMinSize?: number
  /** 可拖动的最小尺寸 */
  minSize?: number
  /** 可拖动的最大尺寸 */
  maxSize?: number
  fullSize?: number
  split?: Split
  color?: string
  key?: string | number
  primary?: SplitPaneProps['primary']
  resizerStyle?: React.CSSProperties
  pane2Style?: React.CSSProperties
  pane1Style?: React.CSSProperties
  dragColor?: string
}

export function useSplitPane(props: UseSplitPaneProps = {}) {
  const {
    defaultMinSize = 0,
    maxSize = 360,
    defaultSize = 240,
    minSize = 240,
    dragMinSize = 240,
    split = 'vertical',
    key = 'USE_SPLIT_PANE',
    color = 'transparent',
    primary = 'first',
    dragColor = '#006eff',
    pane1Style,
    pane2Style,
    resizerStyle,
  } = props
  const [_size, setSize] = useLocalStorage(String(key), defaultSize || minSize)
  const [isDrag, setIsDrag] = useState(false)
  const startSize = useRef<number>(0)
  const size = _size as number

  const onChange = (value: number) => {
    setSize(value)
  }

  const onDragFinished = () => {
    setIsDrag(false)
    document.body.style.cursor = 'auto'
    const isLeft = startSize.current > size

    /* 向左拖动 */
    if (isLeft) {
      if (
        size < Math.min(dragMinSize, defaultSize)
        && (minSize > defaultMinSize ? size < minSize : true)
      )
        setSize(defaultMinSize)
    }
    else {
      if (size < defaultSize)
        setSize(defaultSize)
    }
  }

  const onDragStarted = () => {
    document.body.style.cursor = 'col-resize'
    setIsDrag(true)
    startSize.current = size
  }

  const toggle = () => {
    if (size > defaultMinSize)
      setSize(defaultMinSize)
    else
      setSize(defaultSize)
  }

  return {
    size,
    setSize,
    isDrag,
    toggle,
    props: {
      size,
      minSize,
      maxSize,
      onChange,
      onDragFinished,
      onDragStarted,
      split,
      primary,
      resizerStyle: {
        borderColor: isDrag ? dragColor : 'transparent',
        backgroundColor: isDrag ? dragColor : color,
        ...resizerStyle,
      },
      pane1Style: {
        transition: `all ${isDrag ? 0 : 0.3}s`,
        ...pane1Style,
      },
      pane2Style: {
        transition: `all ${isDrag ? 0 : 0.3}s`,
        ...pane2Style,
      },
    },
  }
}
