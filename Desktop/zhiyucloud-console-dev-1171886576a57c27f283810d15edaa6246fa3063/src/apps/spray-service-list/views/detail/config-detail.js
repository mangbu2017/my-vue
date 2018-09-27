import Vue from 'vue';
import Component from 'vue-class-component';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

// active-line.js
import 'codemirror/addon/selection/active-line';
// language
import 'codemirror/mode/yaml/yaml';
// theme css
import 'codemirror/theme/monokai.css';

import request from '@/common/utils/request';
// import qs from 'qs';


@Component({
    components: {
        codemirror,
    },
})

export default class ConfigEdit extends Vue {
    status = '';
    loading = true;
    code = '';

    cmOptions = {
        tabSize: 4,
        mode: 'text/x-yaml',
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        styleActiveLine: true,
        readOnly: true,
    }

    getConfigDetail(payload) {
        this.loading = true;
        request({
            url: '/sprayBack/appmgr/searchConfigMapConf',
            params: {
                applicationID: payload.id,
                configMapName: payload.name,
            },
        }).then((data) => {
            if (data.resultBean) {
                this.code = data.resultBean;
            }
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            this.$Message.error({
                content: error.message,
            });
        });
    }

    created() {
        this.getConfigDetail({
            id: Number(this.$route.params.id),
            name: this.$route.query.name,
        });
    }
}
