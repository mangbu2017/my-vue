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
            <h2>修改登录密码</h2>
        </div>
        <div class="form-wrap">
            <div class="room-title">
                <p>docker登录时使用的用户名为智渔云账户全名，密码即为现在您设置的密码</p>
            </div>
            <i-form
                v-timely-validate
                ref="formItem"
                :model="formItem"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleOk"
            >
                <i-form-item class="item-pw" label="新密码" prop="password">
                    <i-input
                        v-model="formItem.password"
                        placeholder="请输入新密码"
                        name="password"
                        type="password"
                        style="width: 300px"
                    />
                    <span class="form-tip">字母和数字组成，长度为8-32位</span>
                </i-form-item>
                <i-form-item class="item-pw" label="确认密码" prop="confirmedPassword">
                    <i-input v-model="formItem.confirmedPassword" name="confirmedPassword" placeholder="请再次输入新密码" type="password" style="width: 300px" />
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
                @on-enter="handleSubmit"
            >
                <span v-if="status !== 'request'">确定</span>
                <span v-else>提交中...</span>
            </i-button>
        </div>
    </i-modal>
</template>

<script src="./update-login.js"></script>
<style scoped src="./component-modal.less"></style>

