import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router'
import Chatwindow from './Components/Chatwindow.jsx'

const router = createBrowserRouter([{
 path:'/',
 element:<App/>,
 children:[
  {
    path:'/chat/:chatId',
    element:<Chatwindow/>
  }
 ]
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    {/* <App /> */}
  </StrictMode>,
)
