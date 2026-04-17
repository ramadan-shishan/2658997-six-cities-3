import {configureStore} from '@reduxjs/toolkit';
import {offersReducer, userReducer, commentsReducer} from './reducer.ts';

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
