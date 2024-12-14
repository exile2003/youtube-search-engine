import React from 'react'
import { FixedSizeList } from "react-window";
import moment from 'moment'

function ListItems({ items }) {

  const innerHeight = window.innerHeight;
  const innerWidth = window.innerWidth;

   let dateFormat = '';
  if(items[0]?.date.split('')[0].charCodeAt() < 57) {
    moment.locale('ru');
    dateFormat = 'DD MMMM YYYY, HH:mm:ss';
  } else {
    moment.locale('en');
    dateFormat = 'MMMM DD YYYY, HH:mm:ss';
  }

    return (
          <FixedSizeList
            innerElementType="ul"
            height={innerHeight - 300}
            width={innerWidth -40}
            itemCount={items.length}
            itemSize={30}
            itemData = {items}
            style = {{overflowX: 'hidden', }}
          >
 

          {({data, index, style}) => (
          
            <li style={style} >
              <a href = {data[index].titleLink}>{data[index].title}</a> - &nbsp;
              <a href = {data[index].channelLink}>{data[index].channel}</a> - &nbsp;
              {moment(data[index].date, dateFormat).format('MMMM-DD-YYYY HH:mm:ss')}  
              
            </li>        
          )}
            
          </FixedSizeList>
    )
}

export default ListItems;