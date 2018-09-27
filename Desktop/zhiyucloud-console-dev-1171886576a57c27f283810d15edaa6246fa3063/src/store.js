import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',

    state: {
    },

    mutations: {
    },

    actions: {

    },
});


export function registe(name, module) {
    if (store.state[name]) {
        return;
    }

    if (typeof module === 'object') {
        store.registerModule(name, module);
    }
}


export default store;
