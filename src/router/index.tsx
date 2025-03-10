import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Symbols from '../pages/Symbols';
import Tasks from '../pages/Tasks';
import TaskListResult from '../pages/TaskListResult';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Tasks />,
      },
      {
        path: '/symbols',
        element: <Symbols />,
      },
      // {
      //   path: '/trade-recommendation',
      //   element: <TradeRecommendation />,
      // },
      // {
      //   path: '/info',
      //   element: <Info />,
      // },
      // {
      //   path: '/tasks',
      //   element: <Tasks />,
      // },
    //   {
    //     path: '/about',
    //     element: <About />,
    //   },
    ],

  },
  {
    path: '/task-result/:taskId',
    element: <TaskListResult />,
  },
]); 