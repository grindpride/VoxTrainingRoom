import Vue from 'vue';
import Vuex, {GetterTree, MutationTree} from 'vuex';

import {EventCoords, EventTimeInterval, State, TimeSlotsCoords} from "@/lib/types";
import {monthNames} from "@/lib/consts";
import {createDefaultEvent, getCoordsByTime, getTimeByCoords} from "@/lib/helpers";

Vue.use(Vuex);


const state: State = {
  activeDate: new Date(),
  events: {},
  currentEvent: createDefaultEvent(),
  timeSlotsCoords: null,
};

const getters: GetterTree<State, any> = {
  dateTitle: ({activeDate}) => `${activeDate.getDate()} ${
    monthNames[activeDate.getMonth()]
    } ${activeDate.getFullYear()}`,

  currentDateEvents: ({activeDate, events}) => {
    const dateStr = activeDate.toDateString();

    if (events[dateStr] && events[dateStr].length) {
      return events[dateStr];
    }

    return [];
  }
};

const mutations: MutationTree<State> = {
  changeDate(state, newDate) {
    state.activeDate = newDate;
  },

  addEvent(state, event) {
    const dateStr: string = state.activeDate.toDateString();

    if (!state.events.hasOwnProperty(dateStr)) {
      state.events = {...state.events, [dateStr]: []}
    }

    state.events[dateStr].push(event);
  },

  resetEvent(state) {
    state.currentEvent = createDefaultEvent();
  },

  setTimeSlotCoords(state, timeSlotCoords) {
    state.timeSlotsCoords = timeSlotCoords;
  },

  setCoords(state, {startTime, endTime}) {
    state.currentEvent.startTime = startTime;
    state.currentEvent.endTime = endTime;

    const {top, bottom}: EventCoords = getCoordsByTime(<TimeSlotsCoords[]>(state.timeSlotsCoords), {startTime, endTime});

    state.currentEvent.styles.top = `${top}px`;
    state.currentEvent.styles.height = `${bottom - top}px`;
  },

  setTimeInterval(state, { top, bottom}) {

    const {startTime, endTime}: EventTimeInterval = getTimeByCoords(<TimeSlotsCoords[]>state.timeSlotsCoords, {top, bottom});

    state.currentEvent.startTime = startTime;
    state.currentEvent.endTime = endTime;
  }
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations
});
