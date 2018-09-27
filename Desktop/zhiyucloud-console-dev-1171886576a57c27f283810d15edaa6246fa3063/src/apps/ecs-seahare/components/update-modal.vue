<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        width="700"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
    >
        <div class="modal-title">
            <h2>修改实例名称</h2>
        </div>
        <div class="form-wrap">
            <i-form
                v-timely-validate
                ref="formItem"
                :model="formItem"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleOk"
            >
                <i-form-item label="实例名称" prop="name">
                    <i-input v-model="formItem.name" name="name" placeholder="请输入新实例名称" style="width: 300px" />
                    <span class="form-tip">以大小写字母或中文开头，可包含数字和“-”<br>长度限制为2-64个字符</span>
                </i-form-item>
            </i-form>
        </div>
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
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        name: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: '',
        },
        'on-ok': Function,
        'on-cancel': Function,
    },
    watch: {
        name(val) {
            this.formItem.name = val;
        },
    },
})

export default class UpdateModal extends Vue {
    formItem = {
        name: this.name,
    };

    formRules = {
        name: [
            {
                required: true,
                message: '请输入实例名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.shiliName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                    }
                },
                trigger: 'blur',
            },
        ],
    };

    handleOk() {
        this.$refs.formItem.validate((valid) => {
            if (valid) {
                this.$emit('on-ok', this.formItem.name);
            }
        });
    }

    handleCancel() {
        this.$emit('on-cancel');
    }
}
</script>

<style lang="less" scoped>
  .modal-title {
    margin-bottom: 50px
  }

  h2{
    font-size: 14px
  }

  .ivu-form-item-error-tip {
    padding-top: 2px
  }

  .ivu-form-item {
    position: relative;
    margin-bottom: 18px;
  }

  .ivu-form-item .form-tip{
    position: absolute;
    left: 310px;
    width: 260px;
    color: #999;
    line-height: 1.5;
  }
</style>
