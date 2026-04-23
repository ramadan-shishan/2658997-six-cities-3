import React from 'react';
import {Helmet} from 'react-helmet-async';
import {Link} from 'react-router-dom';
import Header from '../../components/header/header.tsx';
import {AppRoute} from '../../const.ts';

const NotFoundScreen = (): React.ReactElement =>
  (
    <div className="page">
      <Helmet>
        <title>6 cities: page not found</title>
      </Helmet>
      <Header />
      <main className="page__main">
        <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <h1 style={{ fontSize: '100px', color: 'red', margin: 0 }}>404</h1>
          <p style={{ fontSize: '20px' }}>Ой! Страница не найдена!</p>
          <Link
            to={AppRoute.Main}
            style={{
              display: 'inline-block',
              textDecoration: 'none',
              color: '#654321',
              fontSize: '20px',
              fontWeight: '700',
              border: '1px solid #654321',
              padding: '15px 30px',
              marginTop: '10px',
              borderRadius: '10px'
            }}
          >
            Вернуться на главную
          </Link>
        </div>
      </main>
    </div>
  );

export default NotFoundScreen;
