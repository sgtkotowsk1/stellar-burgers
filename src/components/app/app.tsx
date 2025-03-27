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
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredientSlice';
import { AppRoutes } from './appRoutes';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import { fetchCheckAuth } from '../../slices/userSlice';
import { refreshToken, TRegisterData } from '@api';
import { resetOrderModalData } from '../../slices/orderSlice';
import { ErrorMessage } from '../error/error';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchCheckAuth());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(resetOrderModalData());
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
          element={<ProtectedRoute onlyUnAuth children={<Login />} />}
        />
        <Route
          path={AppRoutes.REGISTER}
          element={<ProtectedRoute onlyUnAuth children={<Register />} />}
        />
        <Route
          path={AppRoutes.FORGOT_PASSWORD}
          element={<ProtectedRoute onlyUnAuth children={<ForgotPassword />} />}
        />
        <Route
          path={AppRoutes.RESET_PASSWORD}
          element={<ProtectedRoute onlyUnAuth children={<ResetPassword />} />}
        />
        <Route
          path={AppRoutes.PROFILE}
          element={<ProtectedRoute children={<Profile />} />}
        >
          <Route index element={<Profile />} />
          <Route path='orders' element={<ProfileOrders />} />
        </Route>
        <Route
          path={AppRoutes.PROFILE_ORDERS}
          element={<ProtectedRoute children={<OrderInfo />} />}
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
