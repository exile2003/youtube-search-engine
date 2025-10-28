import 'moment/dist/locale/ru';
import '../../services/i18n';

import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import saveDB from '../../services/saveDB';
import styles from './Form.module.scss';

let youtubeDB = [];
let tempDB = [];

function Form({
  updateItems,
  updateIsLoading,
  udateOpened,
  updateDB,
  dataBase,
  opened,
}) {
  console.log('Form. dataBase', dataBase?.length);

  const { t } = useTranslation();

  const searchButtonRef = useRef(null);
  const fileDownloadButtonRef = useRef(null);
  const titleInputRef = useRef(null);
  const fileDownloadInputRef = useRef(null);

  if (dataBase != null || dataBase != undefined) youtubeDB = dataBase;

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [dateFrom, setDateFrom] = useState(() => '2017-01-01');
  const [dateTo, setDateTo] = useState(() => moment().format('YYYY-MM-DD'));
  const [unique, setUnique] = useState(false);
  const [itemsNumber, setItemsNumber] = useState(0);
  const [fileID, setFileID] = useState(null);

  const titlePrevious = useRef(null);
  const channelPrevious = useRef(null);
  const dateFromPrevious = useRef(null);
  const dateToPrevious = useRef(null);
  const itemsPrevious = useRef(null);
  const uniquePrevious = useRef(null);
  const fileIDPrevious = useRef(null);

  // Method for handle the downloaded file with youtube data
  const handleFileDownload = (event) => {
    console.log('handleFileDownload');
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
      updateItems([]);
      youtubeDB = [];
      // Parsing the content of the input file and assign result to domTree variable
      const domTree = new DOMParser().parseFromString(fileContent, 'text/html');

      // Pass the content of 'content-cell' and 'mdl-cell--6-col' classes to array allSelectors
      const allSelectors = domTree.querySelectorAll('.content-cell.mdl-cell--6-col');

      console.log("true | false",  typeof allSelectors[0].childNodes[3].innerText )
      console.log("true | false",  typeof allSelectors[0].childNodes[3]?.childNodes[0]?.textContent )
      console.log("true | false",  typeof allSelectors[2].childNodes[3]?.childNodes[0]?.textContent)

      // Form the youtubeDB array with youtube videos data
      allSelectors.forEach((item) => item.children[0] && youtubeDB.push({
        title: item.children[0]?.textContent,
        titleLink: item.children[0]?.href,
        channel: item.children[2]?.textContent,
        channelLink: item.children[2]?.href,
        date: item.lastChild?.textContent,
      }));

      // console.log("Form. getFile. reader.onload youtubeDB last", youtubeDB.length);
      console.log('fileDownload', youtubeDB.length);
      saveDB(youtubeDB, 'videos', 'youtubeDB', 'keyYoutubeDB');
      updateDB(youtubeDB);
      updateIsLoading(false);
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateIsLoading(true);

    setTimeout(() => {
      if (
        fileID != fileIDPrevious.current
              | title != titlePrevious.current
              | channel != channelPrevious.current
              | dateFrom != dateFromPrevious.current
              | dateTo != dateToPrevious.current
              | unique != uniquePrevious.current
      ) {
        tempDB = filterYoutubeDB(youtubeDB, title, channel, dateFrom, dateTo);

        if (unique) {
          const uniqueDB = removeDuplicates(tempDB);
          setItemsNumber(uniqueDB.length);
          updateItems(uniqueDB);
        } else {
          setItemsNumber(tempDB.length);
          updateItems(tempDB);
          console.log('The last operation');
        }

        titlePrevious.current = title;
        channelPrevious.current = channel;
        dateFromPrevious.current = dateFrom;
        dateToPrevious.current = dateTo;
        itemsPrevious.current = tempDB;
        uniquePrevious.current = unique;
        fileIDPrevious.current = fileID;
      }
      updateIsLoading(false);
    }, 0);

    if (dataBase == undefined) {
      setTimeout(() => udateOpened(true), 0);
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

  const filterYoutubeDB = (
    youtubeDB,
    title,
    channel,
    dateFrom,
    dateTo,
  ) => {
    let dateFormat = '';
    if (youtubeDB[0]?.date.split('')[0].charCodeAt() < 57) {
      moment.locale('ru');
      dateFormat = 'DD MMMM YYYY, HH:mm:ss';
    } else {
      moment.locale('en');
      dateFormat = 'MMMM DD YYYY, HH:mm:ss';
    }

    const result = youtubeDB
      .filter((item) => item?.title?.toLowerCase().includes(title.trim().toLowerCase()))
      .filter((item) => item?.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
      .filter((item) => (item.date && dateFrom
        ? moment(item?.date, dateFormat).unix() >= moment(dateFrom, 'YYYY-MM-DD').unix()
        : true))
      .filter((item) => (item.date && dateTo
        ? moment(item?.date, dateFormat).unix() <= moment(dateTo, 'YYYY-MM-DD').unix() + 86400
        : true));
    return result;
  };

  const removeDuplicates = (items) => {
    const uniqueItems = {};

    items.forEach((item) => {
      if (!uniqueItems[item.title] || uniqueItems[item.title].date > item.date) {
        uniqueItems[item.title] = item;
      }
    });

    return Object.values(uniqueItems);
  };

  const resetDate = () => {
    //event.preventDefault();
    setDateFrom('2017-01-01');
    setDateTo(moment().format('YYYY-MM-DD'));
  };

  useEffect(() => {
    console.log('Form. useEffect-2', dataBase, opened);
    if (dataBase == undefined) {
      console.log('Form. useEffect-2. DownloadButton.', fileDownloadButtonRef);
      fileDownloadButtonRef.current.focus();
    } else {
      console.log('Form. useEffect-2. TitleInput.');
      titleInputRef.current.focus();
    }
  }, [dataBase, opened]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__title}>Youtube videos</div>
        <input type="file" id="chooseFile" className={styles.chooseFile} onChange={handleFileDownload} ref={fileDownloadInputRef} />
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
