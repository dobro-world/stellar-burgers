import reducer, {
  addIngredient,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../constructorSlice';

const bun = {
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

const main = {
  ...bun,
  _id: '2',
  name: 'Котлета',
  type: 'main'
};

const sauce = {
  ...bun,
  _id: '3',
  name: 'Соус',
  type: 'sauce'
};

describe('burgerConstructor reducer', () => {
  test('should return initial state with unknown action', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('should add bun to constructor', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).not.toBeNull();
    expect(state.bun?.name).toBe('Булка');
    expect(state.ingredients).toHaveLength(0);
  });

  test('should add ingredient to constructor', () => {
    const state = reducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Котлета');
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('should remove ingredient from constructor', () => {
    const stateWithIngredient = reducer(undefined, addIngredient(main));
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const state = reducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  test('should move ingredient up', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(state, addIngredient(sauce));

    const movedState = reducer(state, moveIngredientUp(1));

    expect(movedState.ingredients[0].name).toBe('Соус');
    expect(movedState.ingredients[1].name).toBe('Котлета');
  });

  test('should move ingredient down', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(state, addIngredient(sauce));

    const movedState = reducer(state, moveIngredientDown(0));

    expect(movedState.ingredients[0].name).toBe('Соус');
    expect(movedState.ingredients[1].name).toBe('Котлета');
  });

  test('should clear constructor', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(main));

    const clearedState = reducer(state, clearConstructor());

    expect(clearedState).toEqual({
      bun: null,
      ingredients: []
    });
  });
});