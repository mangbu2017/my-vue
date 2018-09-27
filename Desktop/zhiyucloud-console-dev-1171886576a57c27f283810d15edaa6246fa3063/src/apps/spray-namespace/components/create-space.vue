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
            <h2>创建命名空间</h2>
        </div>
        <div class="form-wrap">
            <div class="room-title">
                <p>1. 一个主账号最多可以创建五个命名空间。</p>
                <p>2. 推荐您创建的每一个命名空间对应一个公司、组织或个人用户，例如zhiyucloud、talailab。而不推荐其对应一个模块或系统，例如tomcat、centos，应用或模块推荐使用仓库进行管理。</p>
            </div>
            <i-form
                v-timely-validate
                ref="form"
                :model="form"
                :rules="formRules"
                :label-width="80"
                @submit.native.prevent="handleSubmit"
            >
                <i-form-item label="命名空间" prop="nameSpace">
                    <i-input v-model="form.nameSpace" name="nameSpace" placeholder="请输入命名空间名称" style="width: 300px" />
                </i-form-item>
                <p class="form-tip">
                    定义您的镜像仓库命名空间，设置后不可修改，长度为2-30位，支持小写字母、数字、“-”、“_”且符号不同在首末位置
                </p>
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

<script src="./create-space.js"></script>
<style scoped src="./create-modal.less"></style>

