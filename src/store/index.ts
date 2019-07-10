import Vue from 'vue';
import Vuex, {GetterTree, } from 'vuex';

import { State} from "@/lib/types";
import {monthNames} from "@/lib/consts";
import {createDefaultEvent} from "@/lib/helpers";
import {mutations} from "@/store/mutations";

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

export const store = new Vuex.Store({
  state,
  getters,
  mutations
});
