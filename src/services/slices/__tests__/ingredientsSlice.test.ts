import reducer, { getIngredients } from '../ingredientsSlice';

const ingredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

describe('ingredientsSlice reducer', () => {
  test('should return initial state with unknown action', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('should handle getIngredients.pending', () => {
    const state = reducer(undefined, getIngredients.pending(''));

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('should handle getIngredients.fulfilled', () => {
    const state = reducer(
      undefined,
      getIngredients.fulfilled([ingredient], '')
    );

    expect(state).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null
    });
  });

  test('should handle getIngredients.rejected', () => {
    const state = reducer(
      undefined,
      getIngredients.rejected(new Error('Ошибка'), '')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка'
    });
  });
});
