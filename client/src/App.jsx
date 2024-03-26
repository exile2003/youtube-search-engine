import { useState, useEffect } from 'react'
import moment from 'moment'
import debounce from 'lodash/debounce'
import './App.css'

let youtubeDB = [];
let tempDB =[];

function App() {

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [items, setItems] = useState([]);

  const getFile = (e) => {
    const inputFile = e.target.files[0];
    const reader = new FileReader();
  
    reader.readAsText(inputFile);
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
      
      console.log("Yes!", youtubeDB)
    };
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChannelChange = (event) => {
    setChannel(event.target.value);
  };

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    tempDB = [];

    tempDB = youtubeDB
                .filter(item => item.title?.toLowerCase().includes(title.trim().toLowerCase()))
                .filter(item => item.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
                .filter(item => 
                  item.date&&dateFrom ? 
                    moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() >= moment(dateFrom, 'YYYY-MM-DD').unix() 
                    : true
                )
                .filter(item => 
                  item.date&&dateTo ? 
                   moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() <= moment(dateTo, 'YYYY-MM-DD').unix() + 86400 
                    : true
                )

    setItems(tempDB)

    console.log('Название:', title);
    console.log('Канал:', channel);
    console.log('Дата:', dateFrom, dateTo);
    console.log("youtubeDB", youtubeDB);
    console.log("tempDB", tempDB);
    console.log("items", items);


  };

 
  const getId = (arg) => {
    const getid =  moment(arg, 'MMMM DD, YYYY, HH:mm:ss').unix() + Math.floor(Math.random()*1000);
    //console.log("getid", getid);
    return getid
  }

 /*
  function getId(arg) {
      const getid =  moment(arg, 'MMMM DD, YYYY, HH:mm:ss').unix() + String(Math.floor(Math.random()*1000));
      console.log("getid", getid);
      return Number(getid)
  }
*/
/*
  useEffect(() => {
    console.log("title, channel")
    console.log( moment(items[0]?.date, 'MMMM DD, YYYY, HH:mm:ss').unix());
    console.log( moment(dateFrom, 'YYYY-MM-DD').unix());
    console.log( moment(dateTo, 'YYYY-MM-DD').unix() + 86400);

    // tempDB = [];

    // tempDB = youtubeDB
    //             .filter(item => item.title?.toLowerCase().includes(title.trim().toLowerCase()))
    //             .filter(item => item.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
    //             .filter(item => 
    //               item.date&&dateFrom ? 
    //                 moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() >= moment(dateFrom, 'YYYY-MM-DD').unix() 
    //                 : true
    //             )
    //             .filter(item => 
    //               item.date&&dateTo ? 
    //                moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() <= moment(dateTo, 'YYYY-MM-DD').unix() + 86400 
    //                 : true
    //             )
  }, [title, channel, dateFrom, dateTo])
  
  useEffect(() => {
    console.log('Items[0]:', items[0]?.date);
  }, [items])
*/
  return (
    <>
      <div className="container">
        <div className="header">
          <h2>Youtube videos</h2>
          <label htmlFor="chooseFile">
            <input onChange= {getFile} type="file" name="chooseFile" id="chooseFile"  />
            <button >Обновить базу данных</button>
          </label>
          
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название:&nbsp;&nbsp;</label>
            
            <input type="text" onChange={debounce((e) => setTitle(e.target.value), 1000)} />
            {/* <input type="text" onChange={(e) => setTitle(e.target.value)} /> */}

          </div>
          <div>
            <label>Название канала:&nbsp;&nbsp;</label>
            <input type="text" onChange={debounce((e) => setChannel(e.target.value), 1000)} />
            {/* <input type="text" onChange={(e) => setChannel(e.target.value)} /> */}

          </div>
          <div>
            <label>Дата:&nbsp;&nbsp;</label>
            от&nbsp;
            <input type="date" onChange={debounce((e) => setDateFrom(e.target.value), 1000)} />
            {/* <input type="date" onChange={(e) => setDateFrom(e.target.value)} /> */}

            &nbsp;до&nbsp;
            <input type="date" onChange={debounce((e) => setDateTo(e.target.value), 1000)} />
            {/* <input type="date" onChange={(e) => setDateTo(e.target.value)} /> */}

          </div>
          <button type="submit">Искать</button>
        </form>
        <ul>
          {items?.map(item =>  
          <li>
            <a href = {item.titleLink}>{item.title}</a> - 
            <a href = {item.channelLink}>{item.channel}</a> - 
            {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY')}
          </li>)}
        </ul>
      </div>
    </>
          
  )
}

export default App
