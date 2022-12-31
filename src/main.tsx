import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './error-page';
import RecipesCalculator from './routes/RecipesCalculator';
import { RouteUrl } from './Routes';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: RouteUrl.CRAFTABLES,
        element: <App />
      },
      {
        path: RouteUrl.RECIPES,
        element: <RecipesCalculator />
      },
    ],
  },
  {
    path: '/hi',
    element: <div>Hello</div>
  },
], {
  basename: import.meta.env.BASE_URL
});


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
