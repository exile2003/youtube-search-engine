import React, { useState, useEffect, memo, useRef, useCallback } from 'react'
import { FixedSizeList } from "react-window";
import moment from 'moment'

function ListItem({ item }) {
  console.count("render ListItem ");
   return (
        <li>
          <a href = {item.titleLink}>{item.title}</a> - 
          <a href = {item.channelLink}>{item.channel}</a> - 
          {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY HH:mm:ss')}     
        </li>
    )
        
}

const MemoListItem = memo(ListItem)

function ListItems({ items }) {

  useEffect(() => console.count("render ListItems"))

    return (
        <div className="container" >
          <FixedSizeList
            height={window.innerHeight}
            width={window.innerWidth - 20}
            itemCount={items.length}
            itemSize={50}
          >
            <ul>
              {items?.map((item, inx) => 
                  <ListItem key={item.title + (moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').unix()).toString()} item={item} />
                  // <MemoListItem key={inx} item={item} />
              )}         
            </ul>
          </FixedSizeList>
          
        </ div>      
    )
}

export default ListItems;