<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        width="700"
        @on-ok="handleSubmit"
        @on-close="handleCancel"
    >
        <div class="modal-title">
            <h2>创建账号</h2>
        </div>
        <div class="form-wrap" style="min-height:303px;">
            <i-form
                v-timely-validate
                ref="form"
                :model="form"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleSubmit"
            >
                <i-form-item label="用户账号" prop="dbAccount">
                    <i-input v-model="form.dbAccount" name="dbAccount" placeholder="请输入用户账号" style="width: 300px" />
                    <span class="form-tip-name form-tip">由小写字母，数字，下划线组成，字母开头，最长16个字符</span>
                </i-form-item>
                <i-form-item class="item-pw" label="输入密码" prop="password">
                    <i-input v-model="form.password" name="password" placeholder="请输入密码" type="password" style="width: 300px" />
                    <span class="form-tip">字母和数字组成，长度为8-32位</span>
                </i-form-item>
                <i-form-item class="item-pw" label="确认密码" prop="confirmedPassword">
                    <i-input v-model="form.confirmedPassword" name="confirmedPassword" placeholder="请输入密码" type="password" style="width: 300px" />
                    <span class="form-tip">请再次输入密码</span>
                </i-form-item>
                <i-form-item label="备注说明" prop="remark">
                    <i-input
                        v-model="form.remark"
                        :autosize="{minRows: 6,maxRows: 6}"
                        name="remark"
                        type="textarea"
                        placeholder="请输入备注"
                        style="width: 300px"
                    />
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
                @on-enter="handleSubmit"
            >
                <span v-if="status !== 'request'">确定</span>
                <span v-else>提交中...</span>
            </i-button>
        </div>
    </i-modal>
</template>

<script src="./create-account.js"></script>
<style scoped src="./alga-modal.less"></style>

