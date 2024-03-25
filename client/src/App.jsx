import { useState, useEffect } from 'react'
import moment from 'moment'
import './App.css'

let youtubeDB = [];
let tempDB =[];

function App() {

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [date, setDate] = useState('');
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
    setDate(event.target.value);
  };

  const handleDateToChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setItems(tempDB)

    let stampUnix = moment(items[0]?.date, 'MMMM DD, YYYY, HH:mm:ss').unix()

    console.log('Название:', title);
    console.log('Канал:', channel);
    console.log('Дата:', stampUnix);
    console.log(youtubeDB);
  };

  useEffect(() => {
    tempDB = youtubeDB
                .filter(item => item.title?.toLowerCase().includes(title.trim().toLowerCase()))
                .filter(item => item.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
  }, [title, channel])
  
  useEffect(() => {
    console.log('Items[0]:', items[0]?.date);
  }, [items])

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
            <input type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div>
            <label>Название канала:&nbsp;&nbsp;</label>
            <input type="text" value={channel} onChange={handleChannelChange} />
          </div>
          <div>
            <label>Дата:&nbsp;&nbsp;</label>
            от&nbsp;
            <input type="date" value={date} onChange={handleDateFromChange} />
            &nbsp;до&nbsp;
            <input type="date" value={date} onChange={handleDateToChange} />
          </div>
          <button type="submit">Искать</button>
        </form>
        <ul>
          {items.map(item =>  
          <li key = {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').unix()} >
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
