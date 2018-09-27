// 创建 mangodb 实例弹窗
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
            <h2>创建实例</h2>
        </div>
        <div class="form-wrap">
            <i-form
                v-timely-validate
                ref="form"
                :model="form"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleSubmit"
            >
                <i-form-item label="实例名称" prop="name">
                    <i-input v-model="form.name" name="name" placeholder="请输入实例名称" style="width: 300px" />
                    <p class="tai-form-item-help-tip">2-64个字符，以大小写字母或中文开头，可包含数字和"-"</p>
                </i-form-item>
                <i-form-item label="地域" prop="region">
                    <i-radio-group v-model="form.region" name="region">
                        <i-radio label="0">北京</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="规格" prop="flavorID">
                    <i-select v-model="form.flavorID" :loading="flavorLoading" name="flavorID" placeholder="请选择规格" style="width: 200px">
                        <i-option v-for="item in form.typeList" :value="item.flavorID" :key="item.flavorID">{{ item.spceDesc }}</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item class="item-pw" label="输入密码" prop="password">
                    <i-input v-model="form.password" name="password" placeholder="请输入密码" type="password" style="width: 300px" />
                    <p class="tai-form-item-help-tip">长度为8-32位，大写、小写、数字、特殊字符.!@#￥%^()_+-=占三种</p>
                </i-form-item>
                <i-form-item class="item-pw" label="确认密码" prop="confirmedPassword">
                    <i-input v-model="form.confirmedPassword" name="confirmedPassword" placeholder="请输入密码" type="password" style="width: 300px" />
                    <span class="form-tip">请再次输入密码</span>
                </i-form-item>
                <i-form-item label="数量" prop="count">
                    <i-input-number :max="100" :min="1" v-model="form.number" name="number" style="width: 50px" />
                    <span class="form-tip">最少可开通1台，最多可开通100台</span>
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

<script src="./create-modal.js"></script>
<style scoped src="./create-modal.less"></style>

