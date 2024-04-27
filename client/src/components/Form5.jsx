import { useState, useEffect, memo, useRef, useCallback, useMemo } from 'react'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import '../App.css'


let youtubeDB = [];
let tempDB = [];
let newTempDB = [];


function Form({ 
      updateItems, 
      updateIsLoading, 
     }) {

    const [title, setTitle] = useState('');
    const [channel, setChannel] = useState('');
    const [dateFrom, setDateFrom] = useState(() => '2017-01-01');
    const [dateTo, setDateTo] = useState(() => moment().format('YYYY-MM-DD'));
  //const [isLoading, setIsLoading] = useState(false);

      //let title2, channel2, dateFrom2, dateTo2;

     const titlePrevious = useRef(null);
     const channelPrevious = useRef(null);
     const dateFromPrevious = useRef(null);
     const dateToPrevious = useRef(null);

    //const [title2, setTitle2] = useState('');
  /*  const [channel2, setChannel2] = useState('');
    const [dateFrom2, setDateFrom2] = useState(() => '2017-01-01');
    const [dateTo2, setDateTo2] = useState(() => moment().format('YYYY-MM-DD'));
*/
    useEffect(() => console.log("render Form", "channel: ", channel))

  const handleFileUpload = (event) => {
    //updateIsLoading(true);
    const file = event.target.files[0];

    // Здесь можно выполнить логику загрузки файла
    try {
      // Предположим, что у вас есть функция для загрузки файла
            if(file) getFile(file);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    } finally {
      //setIsLoading(false);
    }
  }

  const getFile = (file) => {
    
        updateIsLoading(true);

        youtubeDB = [];

        //const inputFile = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
      
        reader.onload = (event) => {
          const fileContent = event.target.result;
          // Parsing the content of the input file and assign result to domTree variable
          const domTree = new DOMParser().parseFromString(fileContent, 'text/html');
      
          // Pass the content of 'content-cell' and 'mdl-cell--6-col' classes to array allSelectors
          const allSelectors = domTree.querySelectorAll('.content-cell.mdl-cell--6-col');

          allSelectors.forEach(item => item.children[0] && youtubeDB.push({
            title: item.children[0]?.textContent,
            titleLink: item.children[0]?.href,
            channel: item.children[2]?.textContent,
            channelLink: item.children[2]?.href,
            date: item.lastChild?.textContent
          }));
          
          console.log("Yes!", youtubeDB);
          updateIsLoading(false)
        }    
  }

  const handleSubmit = (event) => {
    
    event.preventDefault();
    

    //tempDB = [];
    //updateItems(tempDB)

    if(
      title != titlePrevious.current |
      channel != channelPrevious |
      dateFrom != dateFromPrevious |
      dateTo != dateToPrevious
    ) {
      updateIsLoading(true);
      console.log("updateItems");
      tempDB = filterYoutubeDB(youtubeDB, title, channel, dateFrom, dateTo);
      updateItems(tempDB);

      titlePrevious.current = title;
      channelPrevious.current = channel;
      dateFromPrevious.current = dateFrom;
      dateToPrevious.current = dateTo;

      setTimeout(() => updateIsLoading(false), 0);
    };

    //title = txtTitle.current.value;
    //channel = txtChannel.current.value;

    
   // setTitle2(title);
   // setChannel2(channel);
   // setDateFrom2(dateFrom);
   // setDateTo2(dateTo)

    //updateItems(newTempDB);
    //setTimeout(() => updateItems(tempDB), 0);
    

    console.log('Название:', title);
    console.log('Канал:', channel);
    console.log('Дата:', dateFrom, dateTo);
    console.log(typeof dateFrom);
    console.log("youtubeDB", youtubeDB);
    console.log("tempDB", tempDB);
    //console.log("items", items);
    console.log("----------------------------------")
    //console.log("item.date", moment(items[1]?.date, 'MMMM DD, YYYY, HH:mm:ss').unix())
    console.log("dateFrom", moment(dateFrom, 'YYYY-MM-DD').unix())
    //console.log("isLoading", isLoading)
    //console.log("txtTitle", txtTitle.current?.value)
    //console.log('channel2: ', channel2);
    //console.log("newTempDB", newTempDB);


  }

  /*
  useMemo(() => {
    newTempDB = filterYoutubeDB(youtubeDB, title2, channel2, dateFrom2, dateTo2);
    updateItems(newTempDB);
  }, [title, channel, dateFrom, dateTo]);
*/
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