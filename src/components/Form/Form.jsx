import 'moment/dist/locale/ru';
import '../../services/i18n';

import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import saveDB from '../../services/saveDB';
import styles from './Form.module.scss';
import { parseYouTubeFile, filterYoutubeDB, removeDuplicates } from '../../utils/utilityFunctions'


function Form({
  updateItems,
  updateIsLoading,
  updateOpened,
  updateDB,
  dataBase,
  opened,
}) {

  const { t } = useTranslation();

  const searchButtonRef = useRef(null);
  const fileDownloadButtonRef = useRef(null);
  const titleInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [dateFrom, setDateFrom] = useState('2017-01-01');
  const [dateTo, setDateTo] = useState(moment().format('YYYY-MM-DD'));
  const [unique, setUnique] = useState(false);
  const [itemsNumber, setItemsNumber] = useState(0);
// уникальный идентификатор, который создается каждый раз при скачивании файла для случая, 
//когда все поля запроса равны предыдущим значениям (например значениям по-умолчанию), 
//а файл является другим. В этом случае при нажатии на "Поиск" происходит выбор новых данных для вывода
  const [fileID, setFileID] = useState(null); 

// Кэш для хранения данных введенных в поля поиска формы в предыдущий раз, 
// чтобы не проводить повторный поиск, если данные не изменились
  const titlePrevious = useRef(null);
  const channelPrevious = useRef(null);
  const dateFromPrevious = useRef(null);
  const dateToPrevious = useRef(null);
  const uniquePrevious = useRef(null);
  const fileIDPrevious = useRef(null);

  // Method for handle the downloaded file with youtube data
  const handleFileDownload = (event) => {
    const file = event.target.files[0];

    updateItems([]);
    setItemsNumber(0);
    setFileID(() => Symbol());

    try {
      if (file) getFile(file);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    }
  };

  const getFile = (file) => {
    updateIsLoading(true);

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
      const fileContent = event.target.result;
   
      const youtubeDB = parseYouTubeFile(fileContent);

      saveDB(youtubeDB, 'videos', 'youtubeDB', 'keyYoutubeDB');
      updateDB(youtubeDB);
      updateIsLoading(false);
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateIsLoading(true);

    setTimeout(() => {
      if ( fileID != fileIDPrevious.current
           | title != titlePrevious.current
           | channel != channelPrevious.current
           | dateFrom != dateFromPrevious.current
           | dateTo != dateToPrevious.current
           | unique != uniquePrevious.current
      ) {
        const results = filterYoutubeDB(dataBase, title, channel, dateFrom, dateTo);
        const finalResults = unique ? removeDuplicates(results) : results;

        setItemsNumber(finalResults.length);
        updateItems(finalResults);

        titlePrevious.current = title;
        channelPrevious.current = channel;
        dateFromPrevious.current = dateFrom;
        dateToPrevious.current = dateTo;
        uniquePrevious.current = unique;
        fileIDPrevious.current = fileID;
      }
      updateIsLoading(false);
    }, 0);

    if (dataBase == undefined) {
      setTimeout(() => updateOpened(true), 0);
    } else {
      setTimeout(() => titleInputRef.current.focus(), 0);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Выполняем действие клика, если нажата клавиша Enter
      fileDownloadButtonRef.current.click();
    }
  };

  const resetDate = () => {
    setDateFrom('2017-01-01');
    setDateTo(moment().format('YYYY-MM-DD'));
  };

  useEffect(() => {
    if (dataBase == undefined) {
      fileDownloadButtonRef.current.focus();
    } else {
      titleInputRef.current.focus();
    }
  }, [dataBase, opened]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__title}>Youtube videos</div>
        <input type="file" id="chooseFile" className={styles.chooseFile} onChange={handleFileDownload} />
        <label htmlFor="chooseFile" className={styles.custom_file_download} onKeyDown={handleKeyDown} ref={fileDownloadButtonRef} tabIndex="0">
          {t('Download data')}
        </label>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>

        <label htmlFor={styles.name} className={styles.name}>
          {t('Video title:')}
&nbsp;&nbsp;
        </label>
        <input type="text" ref={titleInputRef} value={title} id={styles.name} onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor={styles.channel} className={styles.channel}>
          {t('Channel title:')}
&nbsp;&nbsp;
        </label>
        <input type="text" value={channel} id={styles.channel} onChange={(e) => setChannel(e.target.value)} />

        <label htmlFor={styles.dateFrom} className={styles.dateFrom}>
          <div id={styles.data}>{t('Date: ')}</div>
          <div id={styles.from}>{t('from')}</div>
        </label>
        <input type="date" value={dateFrom} id={styles.dateFrom} onChange={(e) => setDateFrom(e.target.value)} />

        <label htmlFor={styles.dateTo} className={styles.dateTo}>{t('to')}</label>
        <input type="date" value={dateTo} id={styles.dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <button className={styles.resetDate} onClick={resetDate} type="button">{t('Dates reset')}</button>

        <label htmlFor="checkbox">{t('Eliminate repetitions')}</label>
        <input type="checkbox" id="checkbox" className={styles.checkbox} checked={unique} onChange={(e) => setUnique(e.target.checked)} />
        <button type="submit" ref={searchButtonRef}>{t('Search')}</button>
        <div className={styles.itemsNumber}>
          { itemsNumber ? (
            <div>
              {t('Number of found videos: ')}
              {itemsNumber}
            </div>
          ) : ''}
        </div>
      </form>
    </div>
  );
}

export default Form;
