import { Modal } from '@mantine/core';
import { memo, useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { RingLoader } from 'react-spinners';

import styles from './App.module.scss';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import Form from './components/Form/Form';
import ListItems from './components/Listitems/ListItems';
import loadDB from './services/loadDB';

const MemoForm = memo(Form);
const MemoListItems = memo(ListItems);

function App() {
  console.log('App.');
  const { t } = useTranslation();

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
    //() => setItems(value)
  }, []);

  const showSpinner = useCallback((value) => {
    flushSync(() => setIsLoading(value));
    //() => setIsLoading(value)
  }, []);

  return (
    <>
      {isLoading && <div className={styles.spinner} data-testid="spinner"><RingLoader /></div>}
      <div style={isLoading ? { display: 'none' } : {}}>
        <LanguageSelector />
        <MemoForm
          updateItems={updateItems}
          showSpinner={showSpinner}
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