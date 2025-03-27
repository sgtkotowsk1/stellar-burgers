import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

const ProtectedRoute = ({ children, onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.user);

  if (user && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.background || null;
    return (
      <Navigate replace to={from} state={{ background: backgroundLocation }} />
    );
  }

  if (!user && !onlyUnAuth) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
