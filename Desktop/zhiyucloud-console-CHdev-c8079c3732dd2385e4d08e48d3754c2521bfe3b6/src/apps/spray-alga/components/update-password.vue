<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        width="700"
        @on-ok="handleSubmit"
        @on-cancel="handleCancel"
    >
        <div class="modal-title">
            <h2>重置密码</h2>
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
                    <span>{{ accountName }}</span>
                </i-form-item>
                <i-form-item class="item-pw" label="输入密码" prop="password">
                    <i-input v-model="formItem.password" name="password" placeholder="请输入密码" type="password" style="width: 300px" />
                    <span class="form-tip">字母和数字组成，长度为8-32位</span>
                </i-form-item>
                <i-form-item class="item-pw" label="确认密码" prop="confirmedPassword">
                    <i-input v-model="formItem.confirmedPassword" name="confirmedPassword" placeholder="请输入密码" type="password" style="width: 300px" />
                    <span class="form-tip">请再次输入密码</span>
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
                @click="handleSubmit"
            >
                <span v-if="status !== 'request'">确定</span>
                <span v-else>提交中...</span>
            </i-button>
        </div>
    </i-modal>
</template>
<script src="./update-password.js"></script>
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
