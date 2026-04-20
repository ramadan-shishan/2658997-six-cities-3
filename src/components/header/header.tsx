import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { logout } from '../../store/api-actions.ts';
import { AppRoute } from '../../const.ts';
import {
  selectIsAuthorized,
  selectUserEmail,
} from '../../store/selectors.ts';

const Header = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuth = useSelector((state: RootState) => selectIsAuthorized(state));
  const email = useSelector((state: RootState) => selectUserEmail(state));

  const handleLogout = useCallback(() => {
    if (isAuth) {
      dispatch(logout());
    }
  }, [dispatch, isAuth]);

  const isLoginPage = location.pathname === String(AppRoute.Login);
  const showNav = !isLoginPage;

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
          {showNav && (
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
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link
                        className="header__nav-link"
                        to={AppRoute.Main}
                        onClick={handleLogout}
                      >
                        <span className="header__signout">Sign out</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to={AppRoute.Login}
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

const MemoizedHeader = memo(Header);

export default MemoizedHeader;
