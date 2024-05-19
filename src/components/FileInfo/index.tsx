import { useThemeToken } from '@/hooks'
import { sizeFormatter } from '@/utils/file'
import { Flex } from 'antd'
import EllipsisMiddle from '../Common/EllipsisMiddle'
import styles from './index.module.less'

interface FileInfoProps {
  name: string
  size: number
}

const FileInfo = (props: FileInfoProps) => {
  const { name, size } = props
  if (!name) return null
  const { token } = useThemeToken()
  const [ext] = name.split?.('.').reverse()

  return (
    <Flex vertical gap={8} align="center" className={styles.info}>
      <EllipsisMiddle suffixCount={(ext?.length || 0) + 3}>
        {name}
      </EllipsisMiddle>
      <div style={{ color: token.colorTextSecondary, fontSize: 12 }}>
        文件大小：{sizeFormatter(size)}
      </div>
    </Flex>
  )
}

export default FileInfo
