// src/routes/index.ts
import type { RouteObject } from 'react-router-dom';
import Home from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import Cart from '../features/cart/CartPage';
import NotFound from '../pages/NotFound';
import ProductDetailPage from '../pages/ProductDetailPage';

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
    path: '/product/:category/:id',
    element: <ProductDetailPage />,
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
