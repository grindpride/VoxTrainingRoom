import {MutationTree} from "vuex";
import {EventCoords, EventTimeInterval, State, TimeSlotsCoords} from "@/lib/types";
import {createDefaultEvent, getCoordsByTime, getTimeByCoords} from "@/lib/helpers";

export const mutations: MutationTree<State> = {
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

  setEventStyles(state, {top, height}) {
    state.currentEvent.styles.top = top;
    state.currentEvent.styles.height = height;
  },

  setCoords(state, {startTime, endTime}) {
    state.currentEvent.startTime = startTime;
    state.currentEvent.endTime = endTime;

    const {top, bottom}: EventCoords = getCoordsByTime(<TimeSlotsCoords[]>(state.timeSlotsCoords), {
      startTime,
      endTime
    });

    state.currentEvent.styles.top = `${top}px`;
    state.currentEvent.styles.height = `${bottom - top}px`;
  },

  setTimeInterval(state, {top, bottom}) {
    const {startTime, endTime}: EventTimeInterval = getTimeByCoords(<TimeSlotsCoords[]>state.timeSlotsCoords, {
      top,
      bottom
    });

    state.currentEvent.startTime = startTime;
    state.currentEvent.endTime = endTime;
  }
};
