import { Given, When, Then } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';

import { expect } from '@playwright/test';

let browser: Browser;
let page: Page;

Given('SauceDemo login page Check', async () => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.saucedemo.com/');
});

When('login Check with username {string} and password {string}', async (username, password) => {
  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');
});

Then('I should be redirected to the inventory page', async () => {
  await page.waitForURL('**/inventory.html');
  expect(page.url()).toContain('/inventory.html');
  await browser.close();
});

Then('should see the error message', async () => {
  const error = await page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Username and password do not match');
  await browser.close();
});

Then('the username input should have placeholder {string}', async (expected) => {
  const placeholder = await page.getAttribute('[data-test="username"]', 'placeholder');
  expect(placeholder).toBe(expected);
});

Then('the password input should have placeholder {string}', async (expected) => {
  const placeholder = await page.getAttribute('[data-test="password"]', 'placeholder');
  expect(placeholder).toBe(expected);
});

Then('the login button should be visible', async () => {
  const button = page.locator('[data-test="login-button"]');
  await expect(button).toBeVisible();
});

Given('I am logged into SauceDemo', async () => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
});

When('I sort the products by {string}', async (option) => {
  await page.selectOption('[data-test="product_sort_container"]', { label: option });
});
// alphabetical products
Then('the products should be displayed in alphabetical order', async () => {
  const productNames = await page.$$eval('.inventory_item_name', items =>
    items.map(item => item.textContent?.trim() || '')
  );
  const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
  expect(productNames).toEqual(sortedNames);
  await browser.close();
});

// Ascending Order products
Then('should be displayed in ascending order of price', async () => {
  const prices = await page.$$eval('.inventory_item_price', items =>
    items.map(item => parseFloat(item.textContent?.replace('$', '') || '0'))
  );
  const sortedPrices = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sortedPrices);
  await browser.close();
});
