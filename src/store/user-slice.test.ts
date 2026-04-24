import { AuthorizationStatus } from '../const.ts';
import { checkAuth, login, logout } from './api-actions.ts';
import { setAuthorizationStatus, userReducer } from './user-slice.ts';

describe('userReducer', () => {
  it('returns initial state with unknown action', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      authToken: null,
      email: null,
      loading: true,
    });
  });

  it('sets authorization status with action creator', () => {
    const state = userReducer(undefined, setAuthorizationStatus(AuthorizationStatus.Auth));

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Auth);
  });

  it('handles checkAuth.fulfilled', () => {
    const state = userReducer(
      undefined,
      checkAuth.fulfilled({ token: 'token', email: 'test@test.com' }, '', undefined),
    );

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      authToken: 'token',
      email: 'test@test.com',
      loading: false,
    });
  });

  it('handles login.rejected', () => {
    const state = userReducer(
      undefined,
      login.rejected(null, '', { email: 'test@test.com', password: '123qwe' }),
    );

    expect(state.loading).toBe(false);
    expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
  });

  it('handles logout.fulfilled', () => {
    const startState = {
      authorizationStatus: AuthorizationStatus.Auth,
      authToken: 'token',
      email: 'test@test.com',
      loading: false,
    };

    const state = userReducer(startState, logout.fulfilled(undefined, '', undefined));

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      authToken: null,
      email: null,
      loading: false,
    });
  });
});
