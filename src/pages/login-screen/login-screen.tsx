import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppRoute, CITIES } from '../../const.ts';
import { fetchFavorites, login } from '../../store/api-actions.ts';
import type { AppDispatch, RootState } from '../../store/index.ts';
import { changeCity } from '../../store/action.ts';
import type { City } from '../../store/offers-slice.ts';
import Spinner from '../../components/spinner/spinner.tsx';
import ErrorMessage from '../../components/error-message/error-message.tsx';
import Header from '../../components/header/header.tsx';
import {
  selectIsAuthorized,
  selectUserLoading,
} from '../../store/selectors.ts';

const getRandomCity = (): City => CITIES[Math.floor(Math.random() * CITIES.length)];

const LoginScreen = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthorized = useSelector((state: RootState) => selectIsAuthorized(state));
  const userLoading = useSelector((state: RootState) => selectUserLoading(state));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [promoCity] = useState<City>(getRandomCity);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      setErrorMessage(null);

      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        setErrorMessage('Enter a valid email address.');
        return;
      }

      if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password)) {
        setErrorMessage('Password must contain at least one letter and one digit.');
        return;
      }

      setIsLoading(true);
      dispatch(login({ email, password }))
        .unwrap()
        .then(() => {
          dispatch(fetchFavorites());
          navigate(AppRoute.Main);
        })
        .catch(() => {
          setIsLoading(false);
          setErrorMessage('Failed to sign in. Please try again.');
        });
    }
  };

  const handlePromoCityClick = () => {
    dispatch(changeCity(promoCity));
  };

  if (userLoading && !isLoading) {
    return <Spinner />;
  }

  if (isAuthorized) {
    return <Navigate to={AppRoute.Main} />;
  }

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>6 cities: authorization</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            {errorMessage && <ErrorMessage message={errorMessage} />}
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={emailRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link
                className="locations__item-link"
                to={AppRoute.Main}
                onClick={handlePromoCityClick}
              >
                <span>{promoCity}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;
