"use strict";

const SNAKE_DATABASE_HANDLE = "SnakeDatabase";
const SNAKE_DATABASE_VERSION = 1;

function openStorage(indexedDBConnection, databaseHandle, storageHandles) {
	let openRequest = indexedDBConnection.open(databaseHandle, SNAKE_DATABASE_VERSION);

	//nocapitalizationconventionhere !! (not like that's important in an untyped but case-sensitive 'language'...)
	openRequest.onupgradeneeded = event => createStorages(event, storageHandles);
	openRequest.onsuccess = event => databaseOpenedSuccessfully(event);
	openRequest.onerror = event => databaseError(event);

	function createStorages(event, handles){
		/*
			We _must_ retrieve the database from the event, since call backs are async: we can't be sure onsuccess is called first.
		*/
		let actualDB = databaseFrom(event);

		handles.forEach(handle => actualDB.createObjectStore(handle));
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

	return {
		requestStorage : (storageHandle) => {}
	}
};
