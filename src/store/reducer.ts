import {createSlice} from '@reduxjs/toolkit';
import {OfferPreview, OfferDetails} from '../types/offer.ts';
import {Review} from '../types/review.ts';
import {CITIES, AuthorizationStatus} from '../const.ts';
import {fetchOffers, checkAuth, login, logout, fetchComments, addComment, fetchOfferDetails} from './api-actions.ts';

type City = typeof CITIES[number];
type SortType = 'Popular' | 'PriceLowToHigh' | 'PriceHighToLow' | 'TopRated';

interface OffersState {
  city: City;
  offers: OfferPreview[];
  sortType: SortType;
  loading: boolean;
  error: string | null;
  currentOfferDetails: OfferDetails | null;
}

const offersInitialState: OffersState = {
  city: 'Paris',
  offers: [],
  sortType: 'Popular',
  loading: false,
  error: null,
  currentOfferDetails: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState: offersInitialState,
  reducers: {
    changeCity: (state, action: {payload: City}) => {
      state.city = action.payload;
    },
    setOffers: (state, action: {payload: OfferPreview[]}) => {
      state.offers = action.payload;
      state.loading = false;
    },
    setSortType: (state, action: {payload: SortType}) => {
      state.sortType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load offers';
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.currentOfferDetails = action.payload;
      });
  },
});

interface UserState {
  authorizationStatus: AuthorizationStatus;
  authToken: string | null;
  email: string | null;
  loading: boolean;
}

const userInitialState: UserState = {
  authorizationStatus: AuthorizationStatus.NoAuth,
  authToken: null,
  email: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setAuthorizationStatus: (state, action: {payload: AuthorizationStatus}) => {
      state.authorizationStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authToken = action.payload.token;
        state.email = action.payload.email;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authToken = action.payload.token;
        state.email = action.payload.email;
      })
      .addCase(login.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authToken = null;
        state.email = null;
      });
  },
});

interface CommentsState {
  comments: Review[];
  loading: boolean;
  error: string | null;
}

const commentsInitialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load comments';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      });
  },
});

export const {changeCity, setOffers, setSortType} = offersSlice.actions;
export const {setAuthorizationStatus} = userSlice.actions;
export {offersSlice, userSlice, commentsSlice};
export const offersReducer = offersSlice.reducer;
export const userReducer = userSlice.reducer;
export const commentsReducer = commentsSlice.reducer;
export type {OffersState, UserState, CommentsState, City, SortType};
