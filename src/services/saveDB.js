function saveDB(database, objectStore, databaseName, key) {
  
  const openRequest = indexedDB.open(databaseName, 1);

  openRequest.onupgradeneeded = function (e) {
    const thisDB =  e.target.result;
    if (!thisDB.objectStoreNames.contains(objectStore)) {
      thisDB.createObjectStore(objectStore);
    }
  };

  openRequest.onsuccess = function (e) {
    // Also possible the variant const db = openRequest.result;
    const db = e.target.result;
    const tx = db.transaction([objectStore], 'readwrite');
    const store = tx.objectStore(objectStore);
    const request = store.put(database, key);
    console.log('База данных добавлена в хранилище-2', request.result);
    request.onsuccess = function () {
      console.log('База данных добавлена в хранилище', request.result);
    };
  };
}

export default saveDB;
