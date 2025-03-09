import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Info from '../pages/Info';
import Symbols from '../pages/Symbols';
import TradeRecommendation from '../pages/TradeReacomendation';

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
      {
        path: '/trade-recommendation',
        element: <TradeRecommendation />,
      },
    //   {
    //     path: '/about',
    //     element: <About />,
    //   },
    ],
  },
]); 