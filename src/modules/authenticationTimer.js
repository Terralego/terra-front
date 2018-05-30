import timerService from 'services/timerService';
import { refreshToken } from 'modules/authentication';

export const SET_TIMERS = 'SET_TIMERS';
export const REMOVE_TIMERS = 'REMOVE_TIMERS';
export const REMOVE_TIMER_REFRESH_TOKEN = 'REMOVE_TIMER_REFRESH_TOKEN';

const initialState = {
  intervalIdRefresh: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TIMERS:
      return Object.assign({}, state, action.payload);
    case REMOVE_TIMER_REFRESH_TOKEN:
      return Object.assign({}, state, action.payload);
    case REMOVE_TIMERS:
      return initialState;
    default:
      return state;
  }
};

export function setTimers (timers) {
  return {
    type: SET_TIMERS,
    payload: timers,
  };
}

export function removeTimerRefreshToken () {
  return {
    type: REMOVE_TIMER_REFRESH_TOKEN,
    payload: {
      intervalIdRefresh: null,
    },
  };
}

export function disableTimerRefreshToken () {
  return (dispatch, getState) => {
    const { timer } = getState();
    if (timer) {
      timer.intervalIdRefresh &&
        timerService.removeTimer(timer.intervalIdRefresh);
    }
    dispatch(removeTimerRefreshToken());
  };
}

export function enableTimerRefreshToken () {
  disableTimerRefreshToken();
  return (dispatch, getState) => {
    const { config } = getState();
    const timerState = {
      intervalIdRefresh: timerService.addTimer(() => {
        dispatch(refreshToken());
      }, config.REFRESH_TOKEN),
    };
    dispatch(setTimers(timerState));
  };
}
