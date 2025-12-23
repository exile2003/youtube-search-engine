import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

test('file upload + search result', async ({ page }) => {
  // 1. Открываем страницу
  await page.goto('http://localhost:5173');

  // 2. Нажатие на кнопку закрытия модального окна, сигнализирующего об отсутствии БД в IndexedDB
  const closeBtn = page.locator('button[class*="mantine-Modal-close"]');
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();

  // 3. Загружаем файл в input[type="file"]
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join( __dirname, '../public/', 'watch-history.html');
  // Playwright автоматически найдёт <input type="file">
  await page.setInputFiles('input[type="file"]', filePath);

  // 4. Проверка наличия спиннера
  const spinner = page.getByTestId('spinner');
  //await expect(spinner).toBeVisible();
  await spinner.waitFor({ state: 'visible' });
  await spinner.waitFor({ state: 'hidden' });

  // Варианты заполнения поля 'Video title'
  //await page.fill(`#${styles.name}`, 'hello'); 
  // или: await page.getByPlaceholder('enter keyword...').fill('hello');
  // или: await page.locator('input[name="search"]').fill('hello');

  // 5. Нажимаем кнопку 'Search'
  await page.getByRole('button', { name: 'Search' }).click();

  // 6. Проверяем наличие спиннера
   await spinner.waitFor({ state: 'visible' });
   await spinner.waitFor({ state: 'hidden' });
 
  // 7. Проверяем результат
    // Проверка совпадения текста в первой записи
  await expect(page.getByRole('listitem').first()).toContainText('Проверенных Шага Как Новичку в IT');
    // Проверка количества записей (выдается в поле с 'itemsNumber' в классе)
  //await expect(page.locator('[class*="itemsNumber"]')).toContainText('Number of found videos: 40');
  await expect(page.locator('[class*="itemsNumber"]')).toContainText(/\b40\b/);

  // 8. Закрываем страницу
  await page.close();
});