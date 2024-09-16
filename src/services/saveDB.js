function saveDB(database, objectStore, databaseName, key) {

    let db;
    let openRequest = indexedDB.open(databaseName, 1);

    openRequest.onupgradeneeded = function() {
        let thisDB = openRequest.result;
        if(! thisDB.objectStoreNames.contains(objectStore)) {
            thisDB.createObjectStore(objectStore)
        }
    }

    openRequest.onsuccess = function() {
        db = openRequest.result;
        let transaction = db.transaction([objectStore], 'readwrite');
        let store = transaction.objectStore(objectStore);
        let request = store.add(database, key);
        request.onsuccess = function(e) {
            console.log('База данных добавлена в хранилище', request.result);
        }
    }
}

export default saveDB