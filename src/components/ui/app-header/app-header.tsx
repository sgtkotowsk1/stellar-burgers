import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../app/appRoutes';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to={AppRoutes.HOME}
            className={styles.link}
            style={
              location.pathname === AppRoutes.HOME
                ? { color: 'var(--text-primary-color)' }
                : {}
            }
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to={AppRoutes.FEED}
            className={styles.link}
            style={
              location.pathname === AppRoutes.FEED
                ? { color: 'var(--text-primary-color)' }
                : {}
            }
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>

        <div className={styles.link_position_last}>
          <Link
            to={AppRoutes.PROFILE}
            className={styles.link}
            style={
              location.pathname === AppRoutes.PROFILE
                ? { color: 'var(--text-primary-color)' }
                : {}
            }
          >
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
