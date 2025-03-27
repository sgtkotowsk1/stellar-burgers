import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useAppDispatch } from '../../services/store';
import { fetchLogoutUser } from '../../slices/userSlice';
import { deleteCookie, getCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(fetchLogoutUser());
    deleteCookie('accessToken');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
