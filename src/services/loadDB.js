function loadDB(objectStore, databaseName, key, updateOpened, updateDB) {
  //let db;
  const openRequest = indexedDB.open(databaseName, 1);

  openRequest.onsuccess = function () {
    console.log('openRequest.onsuccess');
    const db = openRequest.result;
    if (db.objectStoreNames.contains(objectStore)) {
      const tx = db.transaction([objectStore], 'readonly');
      const store = tx.objectStore(objectStore);
      const request = store.get(key);
      request.onsuccess = function () {
        // console.log("request.onsuccess")
        console.log('LoadDB. request.onsuccess', request.result);
        if (request.result) {
          updateDB(request.result);
        } else {
          updateOpened(true);
        }
      };
    } else {
      const request2 = indexedDB.deleteDatabase(databaseName);
      request2.onsuccess = function () {
        console.log('База данных удалена');
      };
    }
    openRequest.onerror = function () {
      console.log('Ошибка считывания данных');
    };
  };

  openRequest.onerror = function (e) {
    const err = e.target.result;
    console.log('Error', `${err.name}:${err.message}`);
  };
}

export default loadDB;
