import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { logout } from '../../store/api-actions.ts';
import { AppRoute } from '../../const.ts';
import {
  selectFavoritesCount,
  selectIsAuthorized,
  selectUserEmail,
} from '../../store/selectors.ts';

const Header = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuth = useSelector((state: RootState) => selectIsAuthorized(state));
  const email = useSelector((state: RootState) => selectUserEmail(state));
  const favoritesCount = useSelector((state: RootState) => selectFavoritesCount(state));

  const handleLogout = useCallback(() => {
    if (isAuth) {
      dispatch(logout());
    }
  }, [dispatch, isAuth]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className="header__logo-link header__logo-link--active"
              to={AppRoute.Main}
            >
              <img
                className="header__logo"
                src="/img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {isAuth ? (
                <>
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to={AppRoute.Favorites}
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__user-name user__name">
                        {email}
                      </span>
                      <span className="header__favorite-count">
                        {favoritesCount}
                      </span>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <button
                      className="header__nav-link header__signout button"
                      type="button"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to={AppRoute.Login}
                    aria-current={location.pathname === String(AppRoute.Login) ? 'page' : undefined}
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const MemoizedHeader = memo(Header);

export default MemoizedHeader;
