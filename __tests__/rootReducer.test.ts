import { rootReducer } from '../src/services/store';
import ingredientsReducer from '../src/slices/ingredientSlice';
import burgerConstructorReducer from '../src/slices/burgerConstructorSlice';
import feedReducer from '../src/slices/feedSlice';
import orderReducer from '../src/slices/orderSlice';
import userReducer from '../src/slices/userSlice';
import modalReducer from '../src/slices/modalSlice';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      burgerConstructor: burgerConstructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      feed: feedReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      modal: modalReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
