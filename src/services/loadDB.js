function loadDB(objectStore, databaseName, key, udateOpened, updateDB) {
  let db;
  const openRequest = indexedDB.open(databaseName, 1);

  openRequest.onupgradeneeded = function () {
    const thisDB = openRequest.result;
    if (!thisDB.objectStoreNames.contains(objectStore)) {
      thisDB.createObjectStore(objectStore);
    }
  };

  openRequest.onsuccess = function () {
    db = openRequest.result;
    if (db.objectStoreNames.contains(objectStore)) {
      const transaction = db.transaction([objectStore], 'readonly');
      const store = transaction.objectStore(objectStore);
      const request = store.get(key);
      request.onsuccess = function () {
        if (request.result) {
          updateDB(request.result);
        } else {
          udateOpened(true);
        }
      };
    } else {
      const request2 = indexedDB.deleteDatabase(databaseName);
      request2.onsuccess = function () {
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
