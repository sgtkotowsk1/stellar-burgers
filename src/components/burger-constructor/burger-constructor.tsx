import { FC, useEffect, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrderBurger } from '../../slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bun, ingredients } = useAppSelector(
    (state) => state.burgerConstructor
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const { orderModalData, orderRequest } = useAppSelector(
    (state) => state.order
  );

  const constructorItems = {
    bun: bun ?? null,
    ingredients: ingredients ?? []
  };

  const [error, setError] = useState<string | null>(null);

  const onOrderClick = () => {
    if (!constructorItems.bun) {
      setError('Выберите булку для заказа!');
      return;
    }

    if (!constructorItems.bun && !constructorItems.ingredients) {
      setError('Нельзя исполнить пустой заказ:)');
    }

    setError(null); // Очистка ошибки, если всё ок

    if (orderRequest) return;
    if (!isAuthenticated) return navigate('/login');

    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(fetchOrderBurger(order));
  };

  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      error={error}
    />
  );
};
