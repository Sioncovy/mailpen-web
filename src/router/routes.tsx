import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout>
      <Outlet />
    </MainLayout>,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]

export default routes
