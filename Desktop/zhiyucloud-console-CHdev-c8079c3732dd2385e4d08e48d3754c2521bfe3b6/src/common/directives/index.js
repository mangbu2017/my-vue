import Vue from 'vue';
import tryBack from './try-back';
import timelyValidate from './timely-validate';

const directives = {
    'try-back': tryBack,
    'timely-validate': timelyValidate,
};

Object.keys(directives).forEach((key) => {
    const directive = directives[key];
    if (typeof directive === 'object' || typeof directive === 'function') {
        Vue.directive(key, directive);
    }
});

export default directives;
