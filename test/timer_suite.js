import {TICK_SLEEP_TIME_IN_MILLIS, createTimer} from "../web/snake_timer.js";

"use strict";

const MOCK_CALLBACK = () => {console.log("tick.");};
const MOCK_INTERVAL = "MOCK_INTERVAL";

export function MockTimer(){
	this.recorders = {
		start : new Recorder("startTimer"),
		stop : new Recorder("stopTimer")
	};

	this.start = function(callBack){
		this.recorders.start.invokedWith([callBack]);
	};

	this.stop = function(){
		this.recorders.stop.invoked();
	};
}


QUnit.module("Timer");

QUnit.test("Constant values",
	assert => {
	  assert.expect(1);

	  assert.equal(TICK_SLEEP_TIME_IN_MILLIS, 500, "Half a second between ticks");
	}
);


QUnit.test("Starting a timer starts an interval",
	assert => {
	  assert.expect(3);

		withMockSetInterval(
			context => {
				let subject = createTimer();
				subject.start(MOCK_CALLBACK);

				assert.equal(context.invoked, 1, "Timer calls system function.");
				assert.equal(context.delay, TICK_SLEEP_TIME_IN_MILLIS, "Timer uses tick sleep time.");
				assert.equal(context.callBack, MOCK_CALLBACK, "forwards given callback to system.");
			}
		);
	}
);


QUnit.test("Can't start a new timer before stopping the previous.",
	assert => {
	  assert.expect(3);

		withMockSetInterval(
			context => {
				let subject = createTimer();
				subject.start(MOCK_CALLBACK);

				assert.equal(context.invoked, 1, "system is invoked in first start");
				assert.throws(
					() => subject.start(MOCK_CALLBACK),
					new Error("Can't start the timer: Already running."),
					"Starting a running timer throws error"
				);
				assert.equal(context.invoked, 1, "system is not invoked in second start")
			}
		);
	}
);


QUnit.test("Stopping a timer clears the running interval.",
	assert => {
	  assert.expect(1);

		withMockSetInterval(
			ignored => {
				withMockClearInterval(
					clearIntervalContext => {
						let subject = createTimer();

						subject.start(MOCK_CALLBACK);
						subject.stop();

						assert.equal(clearIntervalContext.interval, MOCK_INTERVAL, "Stop uses interval created by start");
					}
				);
			}
		);
	}
);


QUnit.test("Restarting a timer after stopping starts a new interval.",
	assert => {
	  assert.expect(2);

		withMockSetInterval(
			setIntervalContext => {
				withMockClearInterval(
					clearIntervalContext => {
						let subject = createTimer();

						subject.start(MOCK_CALLBACK);
						subject.stop();
						subject.start(MOCK_CALLBACK);

						assert.equal(setIntervalContext.invoked, 2, "system's setInterval is invoked twice.");
						assert.equal(clearIntervalContext.invoked, 1, "system's clearInterval is invoked once");
					}
				);
			}
		);
	}
);


QUnit.test("Can't stop a timer before it has started.",
	assert => {
	  assert.expect(1);

		withMockClearInterval(
			ignored => {
				let subject = createTimer();

				assert.throws(
					()=>subject.stop(),
					new Error("Can't stop the timer: Not running."),
					"Stopping a timer before its start throws error"
				);
			}
		);
	}
);

function withMockSetInterval(test){
	let temp = window.setInterval;
	let context = {
		invoked: 0
	}
	window.setInterval = function(callBack, delay){
		context.invoked += 1;
		context.callBack = callBack;
		context.delay = delay;
		console.log("mock interval created.");
		return MOCK_INTERVAL;
	};

	test(context);

	window.setInterval = temp;
}

function withMockClearInterval(test){
	let temp = window.clearInterval;
	let context = {
		invoked: 0
	}
	window.clearInterval = function(interval){
		context.invoked += 1;
		context.interval = interval;
		console.log("mock interval cleared.");
	};

	test(context);

	window.clearInterval = temp;
}
