"use strict";

const SNAKE_DATABASE_HANDLE = "SnakeDatabase";
const SNAKE_DATABASE_VERSION = 1;

function openStorage(indexedDBConnection, databaseHandle, storageHandles) {
	let openRequest = indexedDBConnection.open(databaseHandle, SNAKE_DATABASE_VERSION);

	//nocapitalizationconventionhere !! (not like that's important in an untyped but case-sensitive 'language'...)
	openRequest.onupgradeneeded = event => createStorages(event, storageHandles);
	openRequest.onsuccess = event => databaseOpenedSuccessfully(event);
	openRequest.onerror = databaseError;

	function createStorages(event, handles){
		/*
			We _must_ retrieve the database from the event, since call backs are async: we can't be sure onsuccess is called first.
		*/
		let actualDB = databaseFrom(event);

		handles.forEach(handle =>{
			let store = actualDB.createObjectStore(handle, {keyPath : "id", autoIncrement:true});
			store.createIndex("result", "result", {unique: false});
		});
		console.log( "stores created for " + handles.join())
	}

	let database;

	function databaseOpenedSuccessfully(event){
		database = databaseFrom(event);
	}

	function databaseError(event){
		console.log(`Database error: ${event.target.errorCode}`);
	}

	function databaseFrom(event){
		/*
			look at this lovely train wreck of a Demeter violation.
			This is from the native API no less, and it's the recommended usage pattern to boot:
			https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
		*/
		return event.target.result;
	}

	function requestStorage(handle){

		async function count(key){
			async function doCount(key){
        return new Promise(function(resolve){
					let request = query("readonly").index("result").count(key.result);
					request.onsuccess = (event) => {
							console.log(`resolving promise with ${event.target.result}`)
							resolve(event.target.result);
					}
					request.onerror = databaseError;
				});
			}
			return await doCount(key);
		}

		function add(value){
			let request = query("readwrite").add(value);
			request.onerror = databaseError;
		}

		function query(mode){
			return database.
				transaction([handle], mode).
				objectStore(handle);
		}

		return {
			count : (key) => count(key),
			add : (value) => add(value)
		};
	}

	return {
		requestStorage : (storageHandle) => requestStorage(storageHandle)
	}
};
