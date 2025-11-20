import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "fake-indexeddb/auto";
import { readFileSync } from 'fs';
import { join } from 'path';
import SearchForm from "../components/Form/Form.jsx";
//import App from "../App.jsx"
import styles from '../components/Form/Form.module.scss'

const dbName = "TestDB";

beforeEach(async () => {
  // Удаляем базу перед каждым тестом
  indexedDB.deleteDatabase(dbName);
});

describe("SearchForm", () => {
  it("loads DB, filters items, and displays correct first result", async () => {

    /*
  global.fetch = vi.fn(async () => ({
      json: () => testDB
  }));  

*/

    // Это лучший вариант, потому что Vitest запоминает и восстанавливает глобал автоматически
    vi.stubGlobal("fetch", async () => ({
      json: () => testDB,
    }));

    // Рендерим компонент
    render(<SearchForm />);
    //  render(<App />);


    const fileBuffer = readFileSync(join(__dirname, '../../public/watch-history.html'), 'utf-8');


    //console.log("fileBuffer", fileBuffer)

    const file = new File([fileBuffer], 'watch-history.html', {
    type: 'text/html',
  });

    const user = userEvent.setup();
    const input = document.querySelector('#chooseFile');
   
    fireEvent.change(input, {
      target: { files: [file] },
  });

  expect(input.files[0].name).toBe('watch-history.html');

    //const el = document.querySelector(`.${styles.custom_file_download}`);
    //expect(el).not.toBeNull();

    //await userEvent.click(el)

   // const input = screen.getByTestId("search-input");
   // const button = screen.getByTestId("search-btn");

    // Вводим фильтр
//    await userEvent.type(input, "Ap");
  //  await userEvent.click(button);

    // Проверяем первую запись результата
//    const items = await screen.findAllByRole("listitem");
//    expect(items[0].textContent).toBe("Apple");
  });
});
