import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import MainLayout from '@/layouts/BasicLayout'
import ChatPage from '@/pages/ChatPage'
import Contact from '@/pages/Contact'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Setting from '@/pages/SettingPage'
import ContactDetail from '@/pages/Contact/ContactDetail'
import ContactSearch from '@/pages/Contact/ContactSearch'
import RequestList from '@/pages/Contact/RequestList'
import Register from '@/pages/Register'
import Profile from '@/components/Profile'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
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
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
        children: [
          {
            path: ':username',
            element: <ChatPage />,
          },
        ],
      },
      {
        path: 'contact',
        element: <Contact>
          <Outlet />
        </Contact>,
        children: [
          {
            path: ':username',
            element: <ContactDetail />,
          },
          {
            path: 'search',
            element: <ContactSearch />,
          },
          {
            path: 'request',
            element: <RequestList />,
          },
        ],
      },
      {
        path: 'setting',
        element: <Setting />,
        children: [
          {
            path: ':name',
            index: true,
          },
        ],
      },
    ],
  },
]

export default routes
