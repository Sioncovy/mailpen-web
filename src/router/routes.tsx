import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Chat = lazy(() => import('../pages/Chat'))
const Contact = lazy(() => import('../pages/Contact'))
const Setting = lazy(() => import('../pages/Setting'))

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
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'setting',
        element: <Setting />,
      },
    ],
  },
]

export default routes
