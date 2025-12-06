import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

test('choose language', async ({ page }) => {
  // Открываем страницу
  await page.goto('http://localhost:5173');

  // нажатие на кнопку закрытия модального окна, сигнализирующего об отсутствии БД в IndexedDB
  await page.locator('button[class*="mantine-Modal-close"]').click();

  // клик на элемент выбора английского языка 'en' и проверка содержимого поля 'Video title:'
  await page.locator('[class*="lang_link"]', {hasText: 'en'}).nth(1).click();
  await expect(await page.locator('label[class*="_name_"]')).toContainText('Video title:');

  // клик на элемент выбора английского языка 'ru' и проверка содержимого поля 'Название видео:'
  await page.locator('[class*="lang_link"]', {hasText: 'ru'}).nth(1).click();
  await expect(await page.locator('label[class*="_name_"]')).toContainText('Название видео:');
  
});