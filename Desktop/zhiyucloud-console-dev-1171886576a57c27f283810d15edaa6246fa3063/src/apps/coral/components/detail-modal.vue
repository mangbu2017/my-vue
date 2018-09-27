<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        width="700"
        @on-cancel="handleCancel"
    >
        <div class="modal-title">
            <h2>日志信息</h2>
        </div>
        <div class="form-wrap">
            <i-form
                ref="formItem"
                :label-width="80"
                @submit.native.prevent="handleOk"
            >
                <i-form-item label="日志名" prop="name">
                    <span>{{ coralName }}</span>
                </i-form-item>
                <i-form-item label="日志描述" prop="msg">
                    <span>{{ coralMsg }}</span>
                </i-form-item>
            </i-form>
        </div>
        <div slot="footer">
            <i-button @click="handleCancel">取消</i-button>
        </div>
    </i-modal>
</template>
<script src="./detail-modal.js"></script>
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
