import { useState, useRef } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ru.js';
import saveDB from '../services/saveDB'
import styles from '../App.module.scss';

let youtubeDB = [];
let tempDB = [];

function Form({ 
      updateItems, 
      updateIsLoading,
      db 
     }) {
      console.log("Form. db", db);

    if (db!= null || db != undefined) youtubeDB = db;

      const [title, setTitle] = useState('');
      const [channel, setChannel] = useState('');
      const [dateFrom, setDateFrom] = useState(() => '2017-01-01');
      const [dateTo, setDateTo] = useState(() => moment().format('YYYY-MM-DD'));
      const [unique, setUnique] = useState(false);
      const [itemsNumber, setItemsNumber] = useState(0);
      const [fileID, setFileID] = useState(null)

      const titlePrevious = useRef(null);
      const channelPrevious = useRef(null);
      const dateFromPrevious = useRef(null);
      const dateToPrevious = useRef(null);
      const itemsPrevious = useRef(null);
      const uniquePrevious = useRef(null);
      const fileIDPrevious = useRef(null);

      const handleFileUpload = (event) => {

          const file = event.target.files[0];

          updateItems([]);
          setItemsNumber(0);
          setFileID(() => Symbol())

          try {
            if(file) getFile(file);
          } catch (error) {
            console.error('Ошибка загрузки файла:', error);
          }
      }

      const getFile = (file) => {
      
          updateIsLoading(true);
          console.log("Form. getFile. youtubeDB before", youtubeDB)
          youtubeDB = [];
          console.log("Form. getFile. youtubeDB after", youtubeDB)

          const reader = new FileReader();
          reader.readAsText(file);
        
          reader.onload = (event) => {
            const fileContent = event.target.result;
            youtubeDB = [];
            // Parsing the content of the input file and assign result to domTree variable
            const domTree = new DOMParser().parseFromString(fileContent, 'text/html');
        
            // Pass the content of 'content-cell' and 'mdl-cell--6-col' classes to array allSelectors
            const allSelectors = domTree.querySelectorAll('.content-cell.mdl-cell--6-col');

            // Form the youtubeDB array with youtube videos data
            allSelectors.forEach(item => item.children[0] && youtubeDB.push({
              title: item.children[0]?.textContent,
              titleLink: item.children[0]?.href,
              channel: item.children[2]?.textContent,
              channelLink: item.children[2]?.href,
              date: item.lastChild?.textContent
            }));
            
            console.log("Form. getFile. reader.onload youtubeDB last", youtubeDB.length);
            saveDB(youtubeDB, 'videos', 'youtubeDB', 'keyYoutubeDB');
            updateIsLoading(false)
          }    
      }

      const handleSubmit = (event) => {
          updateIsLoading(true);
          event.preventDefault();
  
          if(
            fileID != fileIDPrevious.current |
            title != titlePrevious.current |
            channel != channelPrevious.current |
            dateFrom != dateFromPrevious.current |
            dateTo != dateToPrevious.current |
            unique != uniquePrevious.current
          ) {
            
            tempDB = filterYoutubeDB(youtubeDB, title, channel, dateFrom, dateTo);

            if(unique) {
              const uniqueDB = removeDuplicates(tempDB);
              setItemsNumber(uniqueDB.length);
              updateItems(uniqueDB);
            } else {
              setItemsNumber(tempDB.length);
              updateItems(tempDB);
            }
            
            titlePrevious.current = title;
            channelPrevious.current = channel;
            dateFromPrevious.current = dateFrom;
            dateToPrevious.current = dateTo;
            itemsPrevious.current = tempDB;
            uniquePrevious.current = unique;
            fileIDPrevious.current = fileID;           
          };

          setTimeout(() => updateIsLoading(false), 0);
      }

      const filterYoutubeDB = (youtubeDB, title, channel, dateFrom, dateTo) => {

        let dateFormat = '';
        if(youtubeDB[0]?.date.split('')[0].charCodeAt() < 57) {
          moment.locale('ru');
          dateFormat = 'DD MMMM YYYY, HH:mm:ss';
        } else {
          moment.locale('en');
          dateFormat = 'MMMM DD YYYY, HH:mm:ss';
        }
        
        const result = youtubeDB
            .filter(item => item?.title?.toLowerCase().includes(title.trim().toLowerCase()))
            .filter(item => item?.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
            .filter(item =>
              item.date&&dateFrom 
                ? moment(item?.date, dateFormat).unix() >= moment(dateFrom, 'YYYY-MM-DD').unix() 
                : true  
            )
            .filter(item => 
                item.date&&dateTo 
                ? moment(item?.date, dateFormat).unix() <= moment(dateTo, 'YYYY-MM-DD').unix() + 86400 
                : true
            );
        return result
      }

      const removeDuplicates = (array) => {
        const uniqueItems = {};
    
        array.forEach(item => {
          if (!uniqueItems[item.title] || uniqueItems[item.title].date > item.date) {
            uniqueItems[item.title] = item;
          }
        });
        
        return Object.values(uniqueItems);
      }

      const resetDate = (event) => {
        event.preventDefault();
        setDateFrom('2017-01-01'); 
        setDateTo(moment().format('YYYY-MM-DD'));
      }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.h2}>Youtube videos</h2>
         
          <input type="file" id="chooseFile" className={styles.chooseFile} onChange={handleFileUpload} />
          <label htmlFor="chooseFile" className={styles.custom_file_download} >
            Загрузить данные
          </label>            
        </div>
       
        <form onSubmit={handleSubmit} className={styles.form}>

            <label htmlFor="name" className={styles.name} >Название видео:&nbsp;&nbsp;</label>
            <input type="text" value={title} id={styles.name} onChange={(e) => setTitle(e.target.value)} />
         
            <label htmlFor="channel" className={styles.channel} >Название канала:&nbsp;&nbsp;</label>
            <input type="text" value={channel} id={styles.channel} onChange={(e) => setChannel(e.target.value)} />
       
            <label  htmlFor="dateFrom" className={styles.dateFrom}>
              <div id={styles.data}>Дата:</div>
              <div id={styles.from}>от</div>
            </label>
            <input type="date" value={dateFrom} id={styles.dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            
            <label  htmlFor="dateTo" className={styles.dateTo}>до</label>
            <input type="date" value={dateTo} id={styles.dateTo} onChange={(e) => setDateTo(e.target.value)} />
            <button className={styles.resetDate} onClick={resetDate} >Сброс дат</button>
        
            <label htmlFor="checkbox">Исключить повторения</label>
            <input type="checkbox" id="checkbox" className={styles.checkbox} checked={unique} onChange={(e) => setUnique(e.target.checked)} /> 

            <button type="submit">Искать</button>
            
            <div className={styles.itemsNumber}>
            { !!itemsNumber ? <div>&nbsp;&nbsp;&nbsp;&nbsp;{`Количество найденных видео: ${itemsNumber}`}</div> : ''}
            </div>
        </form>
      </div>
    )
  }

export default Form;