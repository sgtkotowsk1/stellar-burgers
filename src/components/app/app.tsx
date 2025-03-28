import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredientSlice';
import { AppRoutes } from './appRoutes';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import { fetchCheckAuth, setAuthChecked } from '../../slices/userSlice';
import { getCookie } from '../../utils/cookie';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      if (getCookie('refreshToken')) {
        await dispatch(fetchCheckAuth());
      } else {
        dispatch(setAuthChecked(true));
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Обычные роуты */}
        <Route path={AppRoutes.HOME} element={<ConstructorPage />} />
        <Route path={AppRoutes.FEED} element={<Feed />} />
        <Route
          path={AppRoutes.INGREDIENT_DETAILS}
          element={<IngredientDetails />}
        />
        <Route path={AppRoutes.ORDER_DETAILS} element={<OrderInfo />} />

        {/* Защищённые роуты */}
        <Route
          path={AppRoutes.LOGIN}
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.REGISTER}
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.FORGOT_PASSWORD}
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.RESET_PASSWORD}
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.PROFILE_ORDERS}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.PROFILE_ORDERS}
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path={AppRoutes.NOT_FOUND} element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path={AppRoutes.INGREDIENT_DETAILS}
            element={
              <Modal onClose={handleModalClose} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={AppRoutes.ORDER_DETAILS}
            element={
              <Modal onClose={handleModalClose} title='Детали заказа'>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={AppRoutes.PROFILE_ORDERS}
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
