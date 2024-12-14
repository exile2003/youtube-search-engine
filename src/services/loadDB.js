import React, { useEffect, useRef } from 'react';

function loadDB(objectStore, databaseName, key, udateOpened, updateDB) {
    let db;
    let openRequest = indexedDB.open(databaseName, 1);

    openRequest.onupgradeneeded = function() {
        console.log("openRequest.onupgradeneeded")
        let thisDB = openRequest.result;
        if(! thisDB.objectStoreNames.contains(objectStore)) {
            thisDB.createObjectStore(objectStore)
            return;
        }
    }

    openRequest.onsuccess = function() {
        console.log("openRequest.onsuccess")
        db = openRequest.result;
        if(!! db.objectStoreNames.contains(objectStore)) {
            let transaction = db.transaction([objectStore], 'readonly');
            let store = transaction.objectStore(objectStore);
            let request = store.get(key);
            request.onsuccess = function() {
                //console.log("request.onsuccess")
                console.log("LoadDB. request.onsuccess", request.result)
                if(!!request.result) {
                    updateDB(request.result);
                } else {  
                    udateOpened(true);
                }
                return;
            }
        } else {
            let request2 = indexedDB.deleteDatabase(databaseName);
            request2.onsuccess = function() {
            console.log("База данных удалена")
            }
        }
        openRequest.onerror = function() {
                console.log("Ошибка считывания данных");
            }        
    }

    openRequest.onerror = function(e) {
        let err = e.target.result;
        console.log("Error", err.name + ":" + err.message);
    }
}

export default loadDB

