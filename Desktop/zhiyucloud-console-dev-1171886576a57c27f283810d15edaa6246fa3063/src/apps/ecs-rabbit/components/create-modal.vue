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
                :label-width="120"
                @submit.native.prevent="handleSubmit"
            >
                <i-form-item label="名称" prop="name">
                    <i-input v-model="form.name" name="name" placeholder="请输入名称" style="width: 300px" />
                    <p class="tai-form-item-help-tip">2-64个字符，以大小写字母或中文开头，可包含数字和“-”</p>
                </i-form-item>
                <i-form-item label="描述" prop="des">
                    <i-input
                        v-model="form.des"
                        :autosize="{minRows: 3,maxRows: 3}"
                        name="des"
                        type="textarea"
                        placeholder="请输入描述信息"
                        style="width: 300px"
                    />
                    <p class="tai-form-item-help-tip">长度为2-256个字符</p>
                </i-form-item>
                <i-form-item label="版本" prop="version">
                    <i-radio-group v-model="form.version" name="version">
                        <i-radio label="0">RabbitMQ 3.7</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="配置" prop="flavor">
                    <i-select v-model="form.flavor" name="flavor" style="width:300px">
                        <i-option v-for="item in flavor" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                    </i-select>
                    <p class="tai-form-item-help-tip">每个节点的CPU数量和内存大小</p>
                </i-form-item>
                <i-form-item label="节点数" prop="nodeNum">
                    <i-radio-group v-model="form.nodeNum" name="nodeNum">
                        <i-radio label="1">单节点</i-radio>
                        <i-radio label="2">双节点</i-radio>
                        <i-radio label="3">三节点</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="公网IP" prop="isBoundPublic">
                    <i-radio-group v-model="form.isBoundPublic" name="isBoundPublic">
                        <i-radio label="1">申请</i-radio>
                        <i-radio label="0">不申请</i-radio>
                    </i-radio-group>
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
<style scoped src="./create-modal.less"></style>

