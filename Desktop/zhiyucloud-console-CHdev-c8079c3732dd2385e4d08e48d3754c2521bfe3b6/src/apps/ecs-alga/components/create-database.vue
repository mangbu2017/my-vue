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
            <h2>创建数据库</h2>
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
                <i-form-item label="数据库名称" prop="dbName">
                    <i-input v-model="form.dbName" name="dbName" placeholder="请输入数据库名称" style="width: 300px" />
                    <span class="form-tip-name form-tip">支持字母，数字以及_，字母开头，<br>长度限制为1-32个字符</span>
                </i-form-item>

                <i-form-item label="支持字符集" prop="charset">
                    <i-radio-group v-model="form.charset" name="charset">
                        <i-radio label="1">utf-8</i-radio>
                        <i-radio label="2">gbk</i-radio>
                        <i-radio label="3">latin1</i-radio>
                    </i-radio-group>
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

<script src="./create-database.js"></script>
<style scoped src="./alga-modal.less"></style>
