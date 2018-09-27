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
import RegRules from '@/common/utils/validate-rules';

@Component({
    components: {
        codemirror,
    },
})

export default class CreateModal extends Vue {
    current = 0;

    code = '';

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
    };

    next() {
        if (this.current === 3) {
            this.current = 0;
        } else {
            this.current += 1;
        }
    }

    status = '';

    form = {
        applicationName: '',
        remark: '',
    };

    formRules = {
        applicationName: [
            {
                required: true,
                message: '请输入应用名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.applicationName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                    }
                },
                trigger: 'blur',
            },
        ],
        remark: [
            {
                required: false,
                message: '请输入应用描述',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.des)) {
                        callback();
                    } else {
                        callback(['应用描述最大长度为100字符']);
                    }
                },
                trigger: 'blur',
            },
        ],
    };

    handleNext() {
        if (this.current === 0) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.current += 1;
                }
            });
        }
    }

    handlePre() {
        if (this.current === 1) {
            this.current = 0;
        }
    }

    handleApply() {
        this.submitData();
    }

    submitData() {
        this.status = 'request';
        request({
            method: 'POST',
            url: '/sprayBack/deploy/deployApplication',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                wareHouseID: Number(this.$route.params.id),
                applicationName: this.form.applicationName,
                remark: this.form.remark,
                config: this.code,
            }),
        }).then(() => {
            this.status = 'success';
            this.current = 2;
        }).catch((error) => {
            this.status = 'failure';
            this.$Message.error({
                content: error.message,
                duration: 10,
            });
        });
    }

    getConfigTemplate() {
        request({
            url: '/sprayBack/deploy/getConfigTemplate',
            params: {
                wareHouseID: Number(this.$route.params.id),
            },
        }).then((data) => {
            if (data.resultBean) {
                this.code = data.resultBean;
            }
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    created() {
        this.getConfigTemplate();
    }
}
