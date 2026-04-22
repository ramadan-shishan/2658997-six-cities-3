import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute } from '../../const.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainScreen from '../../pages/main-screen/main-screen.tsx';
import FavoritesScreen from '../../pages/favorites-screen/favorites-screen.tsx';
import OfferScreen from '../../pages/offer-screen/offer-screen.tsx';
import LoginScreen from '../../pages/login-screen/login-screen.tsx';
import NotFoundScreen from '../../pages/not-found-screen/not-found-screen.tsx';
import PrivateRoute from '../private-route/private-route.tsx';
import type { AppDispatch } from '../../store/index.ts';
import { checkAuth, fetchFavorites } from '../../store/api-actions.ts';

export const AppRoutes = (): React.ReactElement => (
  <Routes>
    <Route path={AppRoute.Main} element={<MainScreen />} />
    <Route path={AppRoute.Login} element={<LoginScreen />} />
    <Route
      path={AppRoute.Favorites}
      element={
        <PrivateRoute>
          <FavoritesScreen />
        </PrivateRoute>
      }
    />
    <Route path={AppRoute.Offer} element={<OfferScreen />} />
    <Route path="*" element={<NotFoundScreen />} />
  </Routes>
);

const App = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth())
      .unwrap()
      .then(() => {
        dispatch(fetchFavorites());
      })
      .catch(() => undefined);
  }, [dispatch]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
