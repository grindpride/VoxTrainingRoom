import Vue from 'vue';
import Vuex, {GetterTree, MutationTree} from 'vuex';

import {State} from "@/lib/types";
import {monthNames} from "@/lib/consts";
import {createDefaultEvent} from "@/lib/helpers";

Vue.use(Vuex);


const state: State = {
  activeDate: new Date(),
  events: {},
  currentEvent: createDefaultEvent()
};

const getters: GetterTree<State, any> = {
  dateTitle: ({activeDate}) => `${activeDate.getDate()} ${
    monthNames[activeDate.getMonth()]
    } ${activeDate.getFullYear()}`,

  currentDateEvents: ({activeDate, events}) => {
    const dateStr = activeDate.toDateString();
    console.log(activeDate, events);
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
  }
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations
});
