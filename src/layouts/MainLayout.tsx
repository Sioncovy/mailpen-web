import { Layout } from 'antd'
import SplitPane from 'react-split-pane'
import { useSplitPane, useThemeToken } from '@/hooks'

function MainLayout(props: any) {
  const { token } = useThemeToken()
  const { props: splitPaneProps } = useSplitPane({
    color: token.colorBorder,
    minSize: 160,
    dragMinSize: 160,
    defaultSize: 300,
    maxSize: 500,
    key: 'main',
    pane1Style: {
      height: '100%',
    },
    pane2Style: {
      height: '100%',
    },
  })

  return (
    <Layout style={{ position: 'relative', height: '100vh', backgroundColor: token.colorBgContainer }}>
      <SplitPane {...splitPaneProps}>
        {props.children}
      </SplitPane>
    </Layout>
  )
}

export default MainLayout
