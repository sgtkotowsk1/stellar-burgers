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

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Обычные роуты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        {/* Защищённые роуты */}
        {/* <Route path="/login" element={<ProtectedRoute element={<Login />} />} />
        <Route path="/register" element={<ProtectedRoute element={<Register />} />} />
        <Route path="/forgot-password" element={<ProtectedRoute element={<ForgotPassword />} />} />
        <Route path="/reset-password" element={<ProtectedRoute element={<ResetPassword />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/profile/orders" element={<ProtectedRoute element={<ProfileOrders />} />} /> */}
        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                onClose={() => {
                  navigate(-1);
                }}
                title='Детали ингредиента'
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={() => {
                  navigate(-1);
                }}
                title='Детали заказа'
              >
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
