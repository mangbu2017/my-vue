import Vue from 'vue';
import dtf from './dtf';

const filters = {
    dtf,
};

Object.keys(filters).forEach((key) => {
    const filter = filters[key];
    if (typeof filter === 'function') {
        Vue.filter(key, filter);
    }
});

export default filters;
