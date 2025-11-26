import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

test('file upload + type in input', async ({ page }) => {
  // Открываем страницу
  await page.goto('http://localhost:5173');

  // 1. Загружаем файл в input[type="file"]

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join( __dirname, '../public/', 'watch-history.html');
  // Playwright автоматически найдёт <input type="file">
  await page.setInputFiles('input[type="file"]', filePath);

  // 2. Вводим текст в поле input
    // нажатие на кнопку закрытия модального окна, сигнализирующего об отсутствии БД в IndexedDB
  await page.locator('button[class*="mantine-Modal-close"]').click();
    // нажатие на элемент label (имитация кнопки) для открытия input[type="file"]
  //await page.locator('[class*="custom_file_download"]').click();

  // Варианты заполнения поля 'Video title'
  //await page.fill(`#${styles.name}`, 'hello'); 
  // или: await page.getByPlaceholder('enter keyword...').fill('hello');
  // или: await page.locator('input[name="search"]').fill('hello');

  // 3. Нажимаем кнопку 'Search'
  await page.getByRole('button', { name: 'Search' }).click();

  // 4. Проверяем результат
    // Проверка совпадения текста в первой записи
  await expect(page.getByRole('listitem').first()).toContainText('Проверенных Шага Как Новичку в IT');
    // Проверка количества записей (выдается в поле с 'itemsNumber' в классе)
  //await expect(page.locator('[class*="itemsNumber"]')).toContainText('Number of found videos: 40');
  await expect(page.locator('[class*="itemsNumber"]')).toContainText(/\b40\b/);

});