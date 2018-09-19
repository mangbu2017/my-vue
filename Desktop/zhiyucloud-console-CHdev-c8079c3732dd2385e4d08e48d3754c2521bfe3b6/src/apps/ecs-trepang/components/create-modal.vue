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
                    <span class="form-tip">支持中文、字母、数字以及_，长度限制<br>为1-64个字符</span>
                </i-form-item>
                <i-form-item label="数据库版本" prop="version">
                    <i-radio-group v-model="form.version" name="version">
                        <i-radio label="0">MongoDB 4.0</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="存储引擎" prop="trigger">
                    <i-radio-group v-model="form.trigger" name="trigger">
                        <i-radio label="0">高性能</i-radio>
                    </i-radio-group>
                </i-form-item>

                <i-form-item label="规格" prop="typeAndFlavor">
                    <i-cascader
                        v-model="form.typeAndFlavor"
                        :data="cascaderData"
                        name="typeAndFlavor"
                        trigger="hover"
                        placeholder="推荐三节点"
                        style="width: 300px"
                    />
                </i-form-item>

                <i-form-item label="存储空间" prop="disk">
                    <i-slider
                        v-model="form.disk"
                        :min="200"
                        :max="500"
                        show-tip="hover"
                        name="disk"
                        show-input
                        style="width: 280px"
                    />
                    <span class="min-size">200GB</span>
                    <span class="max-size">500GB</span>
                    <span class="item-unit">GB</span>

                    <span class="ram-tip">存储空间为200GB～500GB</span>
                </i-form-item>
                <i-form-item label="公网IP" prop="isBoundPublic">
                    <i-radio-group v-model="form.isBoundPublic" name="isBoundPublic">
                        <i-radio label="1">申请</i-radio>
                        <i-radio label="0">不申请</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item class="item-pw" label="输入密码" prop="password">
                    <i-input v-model="form.password" name="password" placeholder="请输入密码" type="password" style="width: 300px" />
                    <span class="form-tip">字母和数字组成，长度为8-32位</span>
                </i-form-item>
                <i-form-item class="item-pw" label="确认密码" prop="confirmedPassword">
                    <i-input v-model="form.confirmedPassword" name="confirmedPassword" placeholder="请输入密码" type="password" style="width: 300px" />
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

<script src="./create-modal.js"></script>
<style scoped src="./create-modal.less"></style>

