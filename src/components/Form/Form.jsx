import 'moment/dist/locale/ru';
import '../../services/i18n';

import moment from 'moment';
import { useEffect, useRef, useState, useMemo } from 'react';
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

  const [filters, setFilters] = useState({
    title: '',
    channel: '',
    dateFrom: '2017-01-01',
    dateTo: new Date().toISOString().split('T')[0],
    unique: false,
  });
  const [itemsNumber, setItemsNumber] = useState(0);
// уникальный идентификатор, который создается каждый раз при скачивании файла для случая, 
//когда все поля запроса равны предыдущим значениям (например значениям по-умолчанию), 
//а файл является другим. В этом случае при нажатии на "Поиск" происходит выбор новых данных для вывода
  const [fileID, setFileID] = useState(null); 

// Кэш для хранения данных введенных в поля поиска формы в предыдущий раз, 
// чтобы не проводить повторный поиск, если данные не изменились
  const prevData = useRef({});

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
      if ( fileID != prevData?.current?.fileID
           | filters.title != prevData?.current?.title
           | filters.channel != prevData?.current?.channel
           | filters.dateFrom != prevData?.current?.dateFrom
           | filters.dateTo != prevData?.current?.dateTo
           | filters.unique != prevData?.current?.unique       
      ) {
      const results = filterYoutubeDB(dataBase, filters);
        const finalResults = filters.unique ? removeDuplicates(results) : results;

        setItemsNumber(finalResults.length);
        updateItems(finalResults);

        prevData.current.title = filters.title;
        prevData.current.channel = filters.channel;
        prevData.current.dateFrom = filters.dateFrom;
        prevData.current.dateTo = filters.dateTo;
        prevData.current.unique = filters.unique;
        prevData.current.fileID = fileID;
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
    setFilters((prev) => ({
      ...prev,
      dateFrom: '2017-01-01',
      dateTo: new Date().toISOString().split('T')[0]
    }));
  };

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFilters((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
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
        <input type="text" name="title" ref={titleInputRef} value={filters.title} id={styles.name} onChange={handleChange} />

        <label htmlFor={styles.channel} className={styles.channel}>
          {t('Channel title:')}
&nbsp;&nbsp;
        </label>
        <input type="text" name="channel" value={filters.channel} id={styles.channel} onChange={handleChange} />

        <label htmlFor={styles.dateFrom} className={styles.dateFrom}>
          <div id={styles.data}>{t('Date: ')}</div>
          <div id={styles.from}>{t('from')}</div>
        </label>
        <input type="date" name="dateFrom" value={filters.dateFrom} id={styles.dateFrom} onChange={handleChange} />

        <label htmlFor={styles.dateTo} className={styles.dateTo}>{t('to')}</label>
        <input type="date" name="dateTo" value={filters.dateTo} id={styles.dateTo} onChange={handleChange} />
        <button className={styles.resetDate} onClick={resetDate} type="button">{t('Dates reset')}</button>

        <label htmlFor="checkbox">{t('Eliminate repetitions')}</label>
        <input type="checkbox" name="unique" id="checkbox" className={styles.checkbox} checked={filters.unique} onChange={handleChange} />
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
