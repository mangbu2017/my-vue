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
            <h2>创建自定义镜像</h2>
            <span class="status"><i /></span>
        </div>
        <div class="form-wrap">
            <div class="create-tip">创建镜像仅对系统盘做完整镜像，不包括数据盘，创建镜像期间不能更改实例状态，如停止或重启实例，请耐心等待。</div>
            <i-form
                v-timely-validate
                ref="form"
                :model="form"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleSubmit"
            >
                <i-form-item label="关联实例" prop="instanceName">
                    {{ name }}
                </i-form-item>
                <i-form-item label="镜像名称" prop="imageName">
                    <i-input v-model="form.imageName" name="imageName" placeholder="请输入镜像名称" style="width: 300px" />
                    <p class="tai-form-item-help-tip">2-64个字符，以大小写字母或中文开头，可包含数字和“-”</p>
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

<script src="./create-image.js"></script>
<style scoped src="./create-image.less"></style>

