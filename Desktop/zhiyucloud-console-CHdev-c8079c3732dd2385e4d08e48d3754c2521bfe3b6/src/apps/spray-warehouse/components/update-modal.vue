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
            <h2>修改基本信息</h2>
        </div>
        <div class="form-wrap">
            <i-form
                v-timely-validate
                ref="form"
                :model="form"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleOk"
            >
                <i-form-item label="仓库类型" prop="houseType">
                    <i-radio-group v-model="form.houseType" name="houseType">
                        <i-radio label="2">私有</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="摘要" prop="digest">
                    <i-input
                        v-model="form.digest"
                        :autosize="{minRows: 3,maxRows: 3}"
                        name="digest"
                        type="textarea"
                        placeholder="请输入摘要"
                        style="width: 300px"
                    />
                </i-form-item>
                <p class="form-tip-long">输入您的仓库的摘要，长度最长为100个字符</p>
                <i-form-item label="描述信息" prop="descInfo">
                    <i-input
                        v-model="form.descInfo"
                        :autosize="{minRows: 3,maxRows: 3}"
                        name="descInfo"
                        type="textarea"
                        placeholder="请输入描述信息"
                        style="width: 300px"
                    />
                </i-form-item>
                <p class="form-tip-long">输入您的仓库的描述信息，长度最长为100个字符</p>
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
<script src="./update-modal.js"></script>
<style src="./component-modal.less"></style>
