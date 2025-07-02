// src/routes/index.tsx
import type { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import Catalog from '../features/catalog/CatalogPage.tsx';
import Product from '../pages/Product.tsx';
import Cart from '../features/cart/CartPage.tsx';
import NotFound from '../pages/NotFound.tsx';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/catalog',
    element: <Catalog />,
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
