function loadDB(objectStore, databaseName, key, updateOpened, updateDB) {
  //let db;
  const openRequest = indexedDB.open(databaseName, 1);

  openRequest.onsuccess = function (e) {
    console.log('openRequest.onsuccess');
    const db = e.target.result;
    if (db.objectStoreNames.contains(objectStore)) {
      const tx = db.transaction([objectStore], 'readonly');
      const store = tx.objectStore(objectStore);
      const request = store.get(key);
      request.onsuccess = function (e) {
        // console.log("request.onsuccess")
        console.log('LoadDB. request.onsuccess', e.target.result);
        if (e.target.result) {
          updateDB(e.target.result);
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
    const err = e.target.error;
    console.log('Error', `${err.name}:${err.message}`);
  };
}

export default loadDB;