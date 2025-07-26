// src/routes/index.ts
import type { RouteObject } from 'react-router-dom';
import Home from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import Product from '../pages/Product';
import Cart from '../features/cart/CartPage';
import NotFound from '../pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/products/:category',
    element: <CatalogPage />,
  },
  {
    path: '/product/:id',
    element: <Product />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
