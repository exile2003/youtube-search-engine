import React, { useState, useEffect, memo, useRef, useCallback } from 'react'
import moment from 'moment'
import { nanoid } from 'nanoid'
import '../App.css'




function ListItem({ item }) {

    const getId = (arg) => {
        const getid =  moment(arg, 'MMMM DD, YYYY, HH:mm:ss').unix() + nanoid();//String(Math.floor(Math.random()*1000000));
       // console.log("getid", getid);
        return getid
      }

    return (
        <li>
          <a href = {item.titleLink}>{item.title}</a> - 
          <a href = {item.channelLink}>{item.channel}</a> - 
          {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY')}     
        </li>
    )
        
}

const PureListItem = memo(ListItem)

function ListItems({ items }) {

    return (
        <div className="container" >
          <ul>
            {items?.map((item, inx) => 
                <PureListItem key={inx} item={item} />
            )}         
          </ul>
        </ div>      
    )
}

export default ListItems;