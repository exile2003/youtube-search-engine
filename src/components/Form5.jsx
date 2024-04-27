import { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { debounce, throttle } from 'lodash'

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

    const titlePrevious = useRef(null);
    const channelPrevious = useRef(null);
    const dateFromPrevious = useRef(null);
    const dateToPrevious = useRef(null);

  const handleFileUpload = (event) => {

    const file = event.target.files[0];

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
          
         // console.log("Yes!", youtubeDB);
          updateIsLoading(false)
        }    
  }

  const handleSubmit = (event) => {
    
    event.preventDefault();
 
    if(
      title != titlePrevious.current |
      channel != channelPrevious.current |
      dateFrom != dateFromPrevious.current |
      dateTo != dateToPrevious.current
    ) {
      updateIsLoading(true);

      tempDB = filterYoutubeDB(youtubeDB, title, channel, dateFrom, dateTo);
      updateItems(tempDB);

      titlePrevious.current = title;
      channelPrevious.current = channel;
      dateFromPrevious.current = dateFrom;
      dateToPrevious.current = dateTo;

      setTimeout(() => updateIsLoading(false), 0);
    };

    console.log('Название:', title);
    console.log('Канал:', channel);
    console.log('Дата:', dateFrom, dateTo);
    console.log("youtubeDB", youtubeDB);
    console.log("tempDB", tempDB);
    console.log("----------------------------------")
    console.log("dateFrom", moment(dateFrom, 'YYYY-MM-DD').unix())
    console.log('titlePrevious: ', titlePrevious);
    console.log('channelPrevious: ', channelPrevious);
  }

  function filterYoutubeDB (youtubeDB, title, channel, dateFrom, dateTo) {
       const result = youtubeDB
                .filter(item => item?.title?.toLowerCase().includes(title.trim().toLowerCase()))
                .filter(item => item?.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
                .filter(item => 
                  item.date&&dateFrom 
                    ? moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() >= moment(dateFrom, 'YYYY-MM-DD').unix() 
                    : true
                )
                .filter(item => 
                  item.date&&dateTo 
                    ? moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() <= moment(dateTo, 'YYYY-MM-DD').unix() + 86400 
                    : true
                );
        return result
  }

    return (
      <div className="container">
        <div className="header">
          <h2>Youtube videos</h2>
          <label htmlFor="chooseFile">
            <input onChange= {handleFileUpload} type="file" name="chooseFile" id="chooseFile"  />
            <button >Обновить базу данных</button>
          </label>
        </div>
       
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название:&nbsp;&nbsp;</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Название канала:&nbsp;&nbsp;</label>
            <input type="text" value={channel} onChange={(e) => setChannel(e.target.value)} />
          </div>
          <div>
            <label>Дата:&nbsp;&nbsp;</label>
            от&nbsp;
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            &nbsp;до&nbsp;
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button type="submit">Искать</button>
        </form>
      </div>
    )
  }

export default Form;