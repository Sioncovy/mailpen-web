import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import MainLayout from '@/layouts/BasicLayout'
import Chat from '@/pages/Chat'
import Contact from '@/pages/Contact'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Setting from '@/pages/Setting'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/*',
    element: <MainLayout>
      <Outlet />
    </MainLayout>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'chat',
        element: <Chat />,
        children: [
          {
            path: ':id',
            element: <Chat />,
          },
        ],
      },
      {
        path: 'contact',
        element: <Contact />,
        children: [
          {
            path: ':id',
            element: <Contact />,
          },
        ],
      },
      {
        path: 'setting',
        element: <Setting />,
        children: [
          {
            path: ':group',
            element: <Setting />,
          },
        ],
      },
    ],
  },
]

export default routes
