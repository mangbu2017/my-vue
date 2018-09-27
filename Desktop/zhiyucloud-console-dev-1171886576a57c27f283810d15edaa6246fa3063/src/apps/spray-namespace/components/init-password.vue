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
            <h2>初始化设置</h2>
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
                <i-form-item class="item-pw" label="密码" prop="password">
                    <i-input
                        v-model="formItem.password"
                        name="password"
                        placeholder="请输入密码"
                        type="password"
                        style="width: 300px"
                    />
                    <p class="tai-form-item-help-tip">长度为8-32位，大写、小写、数字、特殊字符.!@#￥%^()_+-=占三种</p>
                </i-form-item>
                <i-form-item class="item-pw" label="确认密码" prop="confirmedPassword">
                    <i-input
                        v-model="formItem.confirmedPassword"
                        name="confirmedPassword"
                        placeholder="请再次输入密码"
                        type="password"
                        style="width: 300px"
                    />
                    <span class="form-tip">请再次输入密码</span>
                </i-form-item>
            </i-form>
        </div>
        <div slot="footer">
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

<script src="./init-password.js"></script>
<style scoped src="./component-modal.less"></style>

