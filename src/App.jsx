import { Modal } from '@mantine/core';
import {
  memo, useCallback, useEffect, useMemo,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { RingLoader } from 'react-spinners';

import styles from './App.module.scss';
import Form from './components/Form/Form';
import ListItems from './components/Listitems/ListItems';
import loadDB from './services/loadDB';

const MemoForm = memo(Form);
const MemoListItems = memo(ListItems);

function App() {
  console.log('App.');
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback((lng) => i18n.changeLanguage(lng), []);

  const indicateChoosedLanguage = (lng) => {
    const lang_links = document.querySelectorAll(`.${styles.lang_link}`);
    lang_links.forEach((item) => item.classList.remove(styles.lang_link_active));
    lang_links.forEach((item) => item.textContent.trim() === lng && item.classList.add(styles.lang_link_active));
  };

  const handleChangeLanguage = (e) => {
    e.preventDefault();
    changeLanguage(e.target.innerHTML);
    indicateChoosedLanguage(e.target.innerHTML);
    localStorage.setItem('selectedLanguage', e.target.innerHTML);
  };

  const updateDB = useCallback((value) => {
    setDB(value);
  }, []);

  const updateOpened = useCallback((value) => {
    setOpened(value);
  }, []);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBase, setDB] = useState(() => loadDB('videos', 'youtubeDB', 'keyYoutubeDB', updateOpened, updateDB));
  const [opened, setOpened] = useState(false);

  console.log(
    'items',
    items,
    'isLoading',
    isLoading,
    'dataBase',
    dataBase,
    'opened',
    opened,
  );

  const updateItems = useCallback((value) => {
    flushSync(() => setItems(value));
  }, []);

  const updateIsLoading = useCallback((value) => {
    flushSync(() => setIsLoading(value));
  }, []);

  useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
      changeLanguage('en');
      indicateChoosedLanguage('en');
    } else {
      changeLanguage(selectedLanguage);
      indicateChoosedLanguage(selectedLanguage);
    }
  }, []);

  return (
    <>
      {isLoading && <div className={styles.spinner}><RingLoader /></div>}
      <div style={isLoading ? { display: 'none' } : {}}>
        <div className={styles.language}>
          <div className={styles.lang_links}>
            <a className={styles.lang_link} onClick={(e) => handleChangeLanguage(e)}>en</a>
            <a className={styles.lang_link} onClick={(e) => handleChangeLanguage(e)}>ru</a>
          </div>
        </div>
        <MemoForm
          updateItems={updateItems}
          updateIsLoading={updateIsLoading}
          updateOpened={updateOpened}
          updateDB={updateDB}
          dataBase={dataBase}
          opened={opened}
        />
        <MemoListItems items={items} />
        <Modal
          opened={opened}
          onClose={() => updateOpened(false)}
          title={<div><h2>{t('No database available')}</h2></div>}
          withinPortal={false}
        >
          {t('Modal_Window_Description')}
        </Modal>
      </div>
    </>
  );
}
export default App;
