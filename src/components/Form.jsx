import { useState, useRef } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ru.js';
import saveDB from '../services/saveDB'

let youtubeDB = [];
let tempDB = [];

function Form({ 
      updateItems, 
      updateIsLoading, 
     }) {

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

          youtubeDB = [];

          const reader = new FileReader();
          reader.readAsText(file);
        
          reader.onload = (event) => {
            const fileContent = event.target.result;

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
            
            saveDB(youtubeDB, 'videos', 'youtubeDB');
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

      const resetDate = () => {
        setDateFrom('2017-01-01'); 
        setDateTo(moment().format('YYYY-MM-DD'));
      }

    return (
      <div className="container">
        <div className="header">
          <h2>Youtube videos</h2>
         
          <input type="file" id="chooseFile" onChange={handleFileUpload} />
          <label htmlFor="chooseFile" className="custom-file-download" >
            Загрузить данные
          </label>            
        </div>
       
        <form onSubmit={handleSubmit}>

            <label htmlFor="name">Название видео:&nbsp;&nbsp;</label>
            <input type="text" value={title} id="name" onChange={(e) => setTitle(e.target.value)} />
         
            <label htmlFor="channel">Название канала:&nbsp;&nbsp;</label>
            <input type="text" value={channel} id="channel" onChange={(e) => setChannel(e.target.value)} />
       
            <label  htmlFor="dateFrom">
              <div id="data">Дата:</div>
              <div id="from">от</div>
            </label>
            <input type="date" value={dateFrom} id="dateFrom" onChange={(e) => setDateFrom(e.target.value)} />
            
            <label  htmlFor="dateTo">до</label>
            <input type="date" value={dateTo} id="dateTo" onChange={(e) => setDateTo(e.target.value)} />
            <button className="resetDate" onClick={resetDate} >Сброс дат</button>
        
            <label htmlFor="checkbox">Исключить повторения</label>
            <input type="checkbox" id="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> 
            
            <button type="submit">Искать</button>
            
            <div className="itemsNumber">
            { !!itemsNumber ? <div>&nbsp;&nbsp;&nbsp;&nbsp;{`Количество найденных видео: ${itemsNumber}`}</div> : ''}
            </div>

        </form>
      </div>
    )
  }

export default Form;