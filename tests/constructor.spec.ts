import { test, expect } from '@playwright/test';

test.describe('constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/constructor.har', {
      url: '**/api/**',
      update: false
    });

    await page.goto('/');
  });

  test('should add ingredients to constructor', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');

    await page.getByText('Добавить').nth(0).click();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();

    await page.getByText('Добавить').nth(1).click();

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('should open and close ingredient modal', async ({ page }) => {
    await page.getByRole('link', { name: /Краторная булка N-200i/ }).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });

  test('should create order and clear constructor', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.reload();

    const constructor = page.getByTestId('burger-constructor');

    await page.getByText('Добавить').nth(0).click();
    await page.getByText('Добавить').nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByText('12345')).toBeVisible();
    await expect(modal.getByText('идентификатор заказа')).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();

    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});