function saveDB(database, objectStore, databaseName, key) {
  let db;
  console.log("saveDB - start")
  const openRequest = indexedDB.open(databaseName, 1);

  openRequest.onupgradeneeded = function () {
    const thisDB = openRequest.result;
    if (!thisDB.objectStoreNames.contains(objectStore)) {
      thisDB.createObjectStore(objectStore);
    }
  };

  openRequest.onsuccess = function () {
    db = openRequest.result;
    const tx = db.transaction([objectStore], 'readwrite');
    const store = tx.objectStore(objectStore);
    const request = store.put(database, key);
    request.onsuccess = function () {
      console.log('База данных добавлена в хранилище', request.result);
    };
  };
}

export default saveDB;
