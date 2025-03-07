import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Info from '../pages/Info';
import Symbols from '../pages/Symbols';

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
      {
        path: '/symbols',
        element: <Symbols />,
      },
    //   {
    //     path: '/about',
    //     element: <About />,
    //   },
    ],
  },
]); 