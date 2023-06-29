import {
	SNAKE_DATABASE_HANDLE,
	SNAKE_DATABASE_VERSION,
	openStorage
} from "../web/snake_storage.js";

"use strict";

QUnit.module("Storage");

const TEST_DATABASE_HANDLE = "TestDatabase";
const TEST_STORAGE_HANDLE_ONE = "FirstTestStorageHandle";
const TEST_STORAGE_HANDLE_TWO = "SecondTestStorageHandle";

function buildStorage() {
	return new StorageBuilder();
}

function StorageBuilder(){
	this.indexedDBConnection = new MockIndexedDBConnection();
	this.dataBaseHandle = TEST_DATABASE_HANDLE;
	this.storageHandles = [];

	this.build = function(){
		return openStorage(
			this.indexedDBConnection,
			this.dataBaseHandle,
			this.storageHandles
		);
	};

	this.withIndexedDBConnection = function(indexedDBConnection){
		this.indexedDBConnection = indexedDBConnection;
		return this;
	};

	this.withDataBaseHandle = function(dataBaseHandle){
		this.dataBaseHandle = dataBaseHandle;
		return this;
	};

	this.withOpenRequest = function(request){
		this.indexedDBConnection = new MockIndexedDBConnection(request);
		return this;
	};

	this.withStorageHandles = function(handles){
		this.storageHandles = handles;
		return this;
	};
}

QUnit.test("Constant values",
	assert => {
		assert.expect(2);

		assert.equal(SNAKE_DATABASE_HANDLE, "SnakeDatabase", "Name of database is known.");
		assert.equal(SNAKE_DATABASE_VERSION, 1, "Version of database is defined to allow for future increments.");
	}
);


QUnit.test("Opening the storage creates a request to open a database with the given handle.",
	assert => {
		assert.expect(3);

		let mockIndexedDBConnection = new MockIndexedDBConnection();
		let subject = buildStorage().
			withIndexedDBConnection(mockIndexedDBConnection).
			withDataBaseHandle(TEST_DATABASE_HANDLE).
			withStorageHandles(TEST_STORAGE_HANDLE_ONE).
			build();

		let open = mockIndexedDBConnection.recorders.open;
		assert.equal(open.timesInvoked(), 1, "Database is requested.")
		assert.equal(open.invocations[0].arguments[0], TEST_DATABASE_HANDLE, "Given handle is used.")
		assert.equal(open.invocations[0].arguments[1], SNAKE_DATABASE_VERSION, "Use the right version number.")
	}
);


QUnit.test("Opening the storage for the first time uses a callback to initialize the storages in the new database.",
	assert => {
		assert.expect(7);

		let mockRequest = {};
		let subject = buildStorage().
			withOpenRequest(mockRequest).
			withStorageHandles([TEST_STORAGE_HANDLE_ONE, TEST_STORAGE_HANDLE_TWO]).
			build();

		//nocapitalizationconventionhere !!
		let callBack = mockRequest.onupgradeneeded;
    assert.ok(callBack, "Database is prepped for upgrade.")

		// mocks within mocks within mocks, because of the unavoidable native API.
		let mockObjectStore = new MockObjectStore();
		let mockIndexedDB = new MockIndexedDB(mockObjectStore);
		callBack({ target : { result : mockIndexedDB }});

		let createObjectStore = mockIndexedDB.recorders.createObjectStore;
		assert.equal(createObjectStore.timesInvoked(), 2, "Creates a store for each of the storages");
		assert.equal(createObjectStore.invocations[0].arguments[0], TEST_STORAGE_HANDLE_ONE, "first storage is created");
		assert.equal(createObjectStore.invocations[1].arguments[0], TEST_STORAGE_HANDLE_TWO, "second storage is created");

		// index is still hard coded
		let createIndex = mockObjectStore.recorders.createIndex;
		assert.equal(createIndex.timesInvoked(), 2, "Creates an index on each of the object stores");
		assert.propEqual(createIndex.invocations[0].arguments, ["result", "result", {unique: false} ], "first index is hard coded");
		assert.propEqual(createIndex.invocations[1].arguments, ["result", "result", {unique: false} ], "second index is hard coded");
	}
);


QUnit.test("Successfully opening the storage uses a callback to capture the database reference",
	assert => {
		assert.expect(1);

		let mockRequest = {};
		let subject = buildStorage().
			withOpenRequest(mockRequest).
			withStorageHandles([TEST_STORAGE_HANDLE_ONE, TEST_STORAGE_HANDLE_TWO]).
			build();

		//nocapitalizationconventionhere !!
		let callBack = mockRequest.onsuccess;
    assert.ok(callBack, "App awaits the successful opening of the database ")

		let mockIndexedDB = new MockIndexedDB();
		callBack({ target : { result : mockIndexedDB }});
		// FIXME how to assert db capture ?
	}
);


QUnit.test("Failing to open the storage uses a callback to report the error.",
	assert => {
		assert.expect(1);

		let mockRequest = {};
		let subject = buildStorage().
			withOpenRequest(mockRequest).
			withStorageHandles([TEST_STORAGE_HANDLE_ONE, TEST_STORAGE_HANDLE_TWO]).
			build();

		//nocapitalizationconventionhere !!
		let callBack = mockRequest.onerror;
    assert.ok(callBack, "App handles failed opening of the database")

		let mockIndexedDB = new MockIndexedDB();
		callBack({ target : { errorCode : "MOCK_ERROR_CODE" }});
		// asserting error reporting requires generalized logging, which is out of scope.
	}
);
