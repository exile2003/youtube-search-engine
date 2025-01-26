import 'moment/dist/locale/ru';
import '../../services/i18n';

import moment from 'moment';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import saveDB from '../../services/saveDB';
import styles from './Form.module.scss';
import FileDownload from '../FileDownload/FileDownload';
import FilterForm from '../FilterForm/FilterForm'
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
// когда все поля запроса равны предыдущим значениям (например значениям по-умолчанию), 
// а файл является другим. В этом случае при нажатии на "Поиск" происходит выбор данных для вывода

// a unique identifier that is created each time a file is downloaded for the case, 
// when all fields of the request are equal to the previous values (e.g. default values), 
// but the file is different. In this case, clicking on “Search” selects the data to output
  const [fileID, setFileID] = useState(null); 

// кэш для хранения данных введенных в поля поиска формы в предыдущий раз, 
// чтобы не проводить повторный поиск, если данные не изменились

// cache for storing data entered into the form search fields the previous time, 
// so that you don't have to search again if the data hasn't changed
  const prevData = useRef({});

  // Method for handle the downloaded file with youtube data
  const handleFileDownload = (file) => {
    
    updateItems([]);
    setItemsNumber(0);
    setFileID(() => Symbol());

    updateIsLoading(true);

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
      const fileContent = event.target.result;
   
      const parsedData = parseYouTubeFile(fileContent);

      saveDB(parsedData, 'videos', 'youtubeDB', 'keyYoutubeDB');
      updateDB(parsedData);
      updateIsLoading(false);
    };


    reader.onerror = () => {
      console.error('File upload failed:', reader.error);
    };
  };

  //updateOpened(true);

  const handleFilter = () => {
    updateIsLoading(true);

    setTimeout(() => {
      if ( fileID != prevData?.current?.fileID
           | filters.title != prevData?.current?.title
           | filters.channel != prevData?.current?.channel
           | filters.dateFrom != prevData?.current?.dateFrom
           | filters.dateTo != prevData?.current?.dateTo
           | filters.unique != prevData?.current?.unique       
      ) {
      
        const results = (dataBase !== undefined) ? filterYoutubeDB(dataBase, filters) : [];
        const finalResults = filters.unique ? removeDuplicates(results) : results;

        setItemsNumber(finalResults?.length);
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
        <div className={styles.file_download}>
          <FileDownload  ref={fileDownloadButtonRef} onFileDownload={handleFileDownload} />
        </div>  
      </div>
      <FilterForm
          refButton={searchButtonRef} 
          refInput={titleInputRef}
          filters={filters}
          setFilters={setFilters}
          onFilter={handleFilter}
          itemsNumber = {itemsNumber}
      />
    </div>
  );
}

export default Form;
