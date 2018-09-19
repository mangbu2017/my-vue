import Vue from 'vue';
import Component from 'vue-class-component';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

// language
import 'codemirror/mode/yaml/yaml';
// theme css
import 'codemirror/theme/monokai.css';
// require active-line.js
import 'codemirror/addon/selection/active-line';
// styleSelectedText
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/search/searchcursor';
// hint
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/match-highlighter';
// keyMap
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/search';
import 'codemirror/keymap/sublime';
// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';


import request from '@/common/utils/request';
import qs from 'qs';


@Component({
    components: {
        codemirror,
    },
})

export default class ConfigEdit extends Vue {
    status = '';
    loading = true;

    code = ''

    cmOptions = {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        mode: 'text/x-yaml',
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: 'monokai',
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        extraKeys: { Ctrl: 'autocomplete' },
        hintOptions: {
            completeSingle: false,
        },
    }

    getConfig(payload) {
        this.loading = true;
        request({
            url: '/sprayBack/appmgr/searchAppConfInfo',
            params: {
                applicationID: payload.id,
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

    handleSubmit() {
        this.status = 'request';
        if (!this.code || this.code === '') {
            this.$Message.error({
                content: '更新文件不能为空',
            });
        } else {
            request({
                method: 'POST',
                url: '/sprayBack/appmgr/updateConfiguration',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify({
                    applicationID: this.$route.params.id,
                    config: this.code,
                }),
            }).then(() => {
                this.$Message.success({
                    content: '配置更新成功',
                    onClose: () => {
                        this.$router.push('/spray-service-list/1');
                        this.status = 'success';
                    },
                });
            }).catch((error) => {
                this.status = 'failure';
                this.$Message.error({
                    content: error.message,
                    duration: 10,
                });
            });
        }
    }

    created() {
        this.getConfig({
            id: Number(this.$route.params.id),
        });
    }
}
