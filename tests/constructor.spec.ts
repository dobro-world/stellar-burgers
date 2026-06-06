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
    await page.getByText('Добавить').nth(0).click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    await page.getByText('Добавить').nth(1).click();

    await expect(
      page.locator('.constructor-element__text').filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      })
    ).toBeVisible();
  });

  test('should open and close ingredient modal', async ({ page }) => {
    await page.getByRole('link', { name: /Краторная булка N-200i/ }).click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
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

    await page.getByText('Добавить').nth(0).click();
    await page.getByText('Добавить').nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345')).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByText('12345')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});