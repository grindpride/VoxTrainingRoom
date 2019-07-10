import Vue from 'vue';
import Vuex, {GetterTree, MutationTree} from 'vuex';

import {State} from "@/lib/types";
import {monthNames} from "@/lib/consts";
import {createDefaultEvent} from "@/lib/helpers";

Vue.use(Vuex);


const state: State = {
  activeDate: new Date(),
  events: [],
  currentEvent: createDefaultEvent()
};

const getters: GetterTree<State, any> = {
  dateTitle: ({activeDate}) => `${activeDate.getDate()} ${
    monthNames[activeDate.getMonth()]
    } ${activeDate.getFullYear()}`
};

const mutations: MutationTree<State> = {
  changeDate(state, newDate) {
    state.activeDate = newDate;
  },

  addEvent(state, event) {
    state.events.push(event);
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
