import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Info from '../pages/Info'; 
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/info',
        element: <Info />,
      },
    //   {
    //     path: '/about',
    //     element: <About />,
    //   },
    ],
  },
]); 