import {configureStore} from '@reduxjs/toolkit';
import { commentsReducer } from './comments-slice.ts';
import { offersReducer } from './offers-slice.ts';
import { userReducer } from './user-slice.ts';

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
