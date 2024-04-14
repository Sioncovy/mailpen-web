import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { addRxPlugin } from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import router from './router'
import Loading from './components/Loading'

addRxPlugin(RxDBDevModePlugin)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<Loading height="100vh" />}>
    <RouterProvider router={router} />
  </Suspense>,
)
