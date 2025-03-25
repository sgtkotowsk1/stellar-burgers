import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrderBurger } from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useAppDispatch();

  const { bun, ingredients, orderRequest, orderModalData } = useAppSelector(
    (state) => state.burgerConstructor
  );

  const constructorItems = {
    bun: bun ?? null,
    ingredients: ingredients ?? []
  };

  const onOrderClick = () => {
    if (!constructorItems.bun) return;

    // if (!isAuthenticated) {
    //   return navigate('/login');
    // }

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
    />
  );
};
