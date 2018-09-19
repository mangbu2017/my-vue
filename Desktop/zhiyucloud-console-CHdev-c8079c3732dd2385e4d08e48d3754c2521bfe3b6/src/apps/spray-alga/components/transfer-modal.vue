<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        :title="title"
        width="700"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
    >

        <i-transfer
            :data="data"
            :target-keys="targetKey"
            :list-style="listStyle"
            :render-format="renderFormat"
            :operations="['移除', '添加']"
            :titles="['未授权列表', '已授权列表']"
            filterable
            @on-change="handleChange"
            @click.native.capture="handleRadioClick"
        />
        <slot name="aside" />
        <div slot="footer">
            <i-button
                :disabled="status === 'request'"
                @click="handleCancel"
            >取消</i-button>
            <i-button
                :loading="status === 'request'"
                type="primary"
                @click="handleOk"
            >
                <span v-if="status !== 'request'">确定</span>
                <span v-else>提交中...</span>
            </i-button>
        </div>
    </i-modal>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import _ from 'lodash';


@Component({
    props: {
        list: {
            type: Array,
            default: [],
        },
        status: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: 'Transfer',
        },
        'on-ok': Function,
        'on-cancel': Function,
    },
    watch: {
        list() {
            // 避免子组件修改父组件的数据
            this.data = this.list.map((item) => {
                const d = this.data.find(i => i.key === item.key);
                return _.merge({}, item, d);
            });
        },
    },

    computed: {
        targetKey() {
            return this.data
                .filter(item => item.selected)
                .map(item => item.key);
        },
    },
})

export default class TransferModal extends Vue {
    data = _.merge([], this.list);

    listStyle = {
        width: '290px',
        height: '300px',
    };

    handleChange(newTargetKeys, direction, moveKeys) {
        if (direction === 'right') {
            newTargetKeys.forEach((key) => {
                const index = this.data.findIndex(item => key === item.key);
                if (index >= 0) {
                    const newItem = _.merge({}, this.data[index], { selected: true });
                    this.data.splice(index, 1, newItem);
                }
            });
        } else {
            moveKeys.forEach((key) => {
                const index = this.data.findIndex(item => key === item.key);
                if (index >= 0) {
                    const newItem = _.merge({}, this.data[index], { selected: false });
                    this.data.splice(index, 1, newItem);
                }
            });
        }
    }

    renderFormat(item) {
        const radios = item.radios.map(permission => `
            <label class="transfer-item-radio">
                <input
                    type="radio"
                    name="${item.key}"
                    ${item.disabled ? 'disabled' : ''}
                    ${permission.selected ? 'checked' : ''}
                    value="${permission.value}"
                />
                ${permission.label}
            </label>
        `).join('');

        return `<div class="transfer-item">
                <span class="transfer-item-label">${item.label}</span>
                <span class="transfer-item-radio-group">
                    ${radios}
                </span>
            </div>`;
    }

    handleOk() {
        const selectedItems = this.data.filter(item => item.selected);
        this.$emit('on-ok', _.merge([], selectedItems));
    }

    handleCancel() {
        this.$emit('on-cancel');
    }

    handleRadioClick(event) {
        const { type, classList } = event.target;

        if (type === 'radio' || classList.contains('transfer-item-radio') || classList.contains('transfer-item-radio-group')) {
            event.stopPropagation();

            if (type !== 'radio') {
                return;
            }

            const { name, value } = event.target;
            const clicked = this.data.find(item => item.key === name);
            clicked.radios.forEach((item) => {
                if (String(item.value) === value) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });
        }
    }
}
</script>

<style lang="less">
    .transfer-item {
        display: inline-flex;
        width: calc(100% - 32px);
    }

    .transfer-item-label {
        flex: 1;
    }

    .transfer-item-radio + .transfer-item-radio {
        margin-left: 8px;
    }

    .transfer-item-radio-group {
        width: 96px;
        text-align: right;
    }
</style>
