import { test, expect } from '@playwright/test';
import path from 'path';
import styles from '../src/components/Form/Form.module.scss'


test('file upload + type in input', async ({ page }) => {
  // Открываем страницу
  await page.goto('http://localhost:5173');

  // 1. Загружаем файл в input[type="file"]
  // const filePath = path.join(__dirname, 'data', 'example.txt'); 
    const filePath = path.join('public/watch-history.html');
    // ⚠ Убедись что файл существует в проекте: tests/data/example.txt

  // Playwright автоматически найдёт <input type="file">
  await page.setInputFiles('input[type="file"]', filePath);

  // 2. Вводим текст в поле input
  await page.fill(`#${styles.name}`, 'hello'); 
  // или: await page.getByPlaceholder('enter keyword...').fill('hello');
  // или: await page.locator('input[name="search"]').fill('hello');

  // 3. (Опционально) нажимаем кнопку
  await page.click('#search-btn');

  // 4. Проверяем результат
  await expect(page.locator('#result')).toContainText('expected text');
});