"use strict";

export const TICK_SLEEP_TIME_IN_MILLIS = 500;


export function createTimer(){
	const NO_TIMER = {};

	function Timer(){
		this.interval = NO_TIMER;

		this.start = function(callback){
      if(this.interval !== NO_TIMER)
        throw new Error("Can't start the timer: Already running.");
      this.interval = window.setInterval(callback, TICK_SLEEP_TIME_IN_MILLIS);
    };

    this.stop = function(){
      if(this.interval === NO_TIMER)
        throw new Error("Can't stop the timer: Not running.");
      window.clearInterval(this.interval);
      this.interval = NO_TIMER;
    };
	}

	let timer = new Timer();

	return {
		start : (callback)=>timer.start(callback),
		stop : ()=>timer.stop()
	};
}
