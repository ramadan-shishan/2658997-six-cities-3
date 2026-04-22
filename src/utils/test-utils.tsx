import type { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../store/index.ts';
import { commentsReducer } from '../store/comments-slice.ts';
import { favoritesReducer } from '../store/favorites-slice.ts';
import { offersReducer } from '../store/offers-slice.ts';
import { userReducer } from '../store/user-slice.ts';

export const makeTestStore = (preloadedState?: Partial<RootState>) => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    comments: commentsReducer,
    favorites: favoritesReducer,
  },
  preloadedState: preloadedState as RootState,
});

type ExtendedRenderOptions = {
  route?: string;
  preloadedState?: Partial<RootState>;
};

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', preloadedState }: ExtendedRenderOptions = {},
) => {
  const store = makeTestStore(preloadedState);

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </HelmetProvider>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
};
