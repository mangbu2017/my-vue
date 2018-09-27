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
                <i-form-item label="数据库类型" prop="version">
                    <i-radio-group v-model="form.version" name="version">
                        <i-radio label="0">MySQL 5.7</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="规格" prop="typeAndFlavor">
                    <i-cascader
                        v-model="form.typeAndFlavor"
                        :data="cascaderData"
                        name="typeAndFlavor"
                        trigger="hover"
                        placeholder="推荐基础版"
                        style="width: 300px"
                    />
                </i-form-item>
                <tai-slider
                    v-model="form.disk"
                    :min="20"
                    :max="1000"
                />
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
<style scoped src="./alga-modal.less"></style>

