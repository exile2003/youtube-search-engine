import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

//import styles from '../src/components/Form/Form.module.scss'


test('file upload + type in input', async ({ page }) => {
  // Открываем страницу
  await page.goto('http://localhost:5173');

  // 1. Загружаем файл в input[type="file"]
  // const filePath = path.join(__dirname, 'data', 'example.txt'); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join( __dirname, '../public/', 'watch-history.html');

  // Playwright автоматически найдёт <input type="file">
  await page.setInputFiles('input[type="file"]', filePath);

  // 2. Вводим текст в поле input
  //await page.locator('.mantine-Modal-overlay').waitFor({ state: 'hidden' });
  await page.locator('button[class*="mantine-Modal-close"]').click();
  //await page.locator('[class*="custom_file_download"]').click();
  //await page.fill(`#${styles.name}`, 'hello'); 
  // или: await page.getByPlaceholder('enter keyword...').fill('hello');
  // или: await page.locator('input[name="search"]').fill('hello');

  // 3. (Опционально) нажимаем кнопку
  //await page.click('#search-btn');
  await page.getByRole('button', { name: 'Search' }).click();

  const text = await page.getByRole('listitem').first().textContent();
  //console.log(text)

  // 4. Проверяем результат
  await expect(text?.split(' ')[1]).toContain("Проверенных");
  //await expect(page.getByRole('listitem')).toContainText('Проверенных Шага Как Новичку в IT');
  //await expect(page.locator('#result')).toContainText('expected text');
});