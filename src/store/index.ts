import Vue from 'vue';
import Vuex, {GetterTree, MutationTree} from 'vuex';

import {State} from "@/lib/types";

Vue.use(Vuex);

const state: State = {
  activeDate: new Date(),
  events: [],
  currentEvent: null
};

const getters: GetterTree<State, any> = {

};

const mutations: MutationTree<State>  ={
  changeDate(state, newDate) {
    state.activeDate = newDate;
  }
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations
});
