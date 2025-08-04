// src/routes/index.ts
import type { RouteObject } from 'react-router-dom';
import Home from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import NotFound from '../pages/NotFound';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import FavoritesPage from '../pages/FavoritesPage';
import AuthPage from '../pages/AuthPage';

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
    element: <CartPage />,
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
