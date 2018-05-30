class TimerService {
  constructor () {
    this.timers = [];
  }
  addTimer (callback, timeout) {
    const intervalID = window.setInterval(callback, timeout);
    this.timers.push(intervalID);
    return intervalID;
  }
  removeTimer (intervalID) {
    window.clearInterval(intervalID);
    this.timers = this.timers.filter(currentIntervalID => intervalID !== currentIntervalID);
  }
}

export default new TimerService();
