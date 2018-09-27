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
            <h2>新增节点</h2>
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
                <i-form-item label="节点数量" prop="nodeNum">
                    <i-input-number :max="10" :min="1" v-model="formItem.nodeNum" name="nodeNum" />
                    <span class="form-tip-number">最多可添加10个节点</span>
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

@Component({
    props: {
        status: {
            type: String,
            default: '',
        },
        'on-ok': Function,
        'on-cancel': Function,
    },
})

export default class UpdateModal extends Vue {
    formItem = {
        nodeNum: 1,
    };

    formRules = {
        nodeNum: [
            {
                required: true,
                type: 'number',
                message: '节点数量支持1-10个节点',
                trigger: 'blur',
            },
        ],
    };

    handleOk() {
        this.$refs.formItem.validate((valid) => {
            if (valid) {
                this.$emit('on-ok', this.formItem.nodeNum);
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

  .ivu-form-item .form-tip-number{
      position: absolute;
      top: 8px;
      left: 90px;
      width: 260px;
      color: #999;
      line-height: 1.5;
  }
</style>
