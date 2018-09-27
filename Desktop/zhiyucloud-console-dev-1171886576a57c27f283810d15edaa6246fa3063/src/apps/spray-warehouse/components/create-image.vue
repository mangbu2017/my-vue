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
            <h2>创建镜像仓库</h2>
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
                <i-form-item v-if="namespaceLength" label="命名空间" prop="nameSpaceID">
                    <i-select v-model="form.nameSpaceID" name="nameSpaceID" style="width:300px">
                        <i-option v-for="item in namespaceList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item v-else label="命名空间" prop="nameSpaceID">
                    <i-button type="primary" @click="handleCreateNamespace">创建命名空间</i-button>
                    <span class="form-tip form-tip-name" style="left: 130px">您还没有创建命名空间<br>单击创建首个命名空间</span>
                </i-form-item>
                <i-form-item label="仓库名称" prop="wareHouseName">
                    <i-input v-model="form.wareHouseName" name="wareHouseName" placeholder="请输入仓库名称" style="width: 300px" />
                </i-form-item>
                <p class="form-tip-long">输入您的镜像仓库名称，长度为2-40位。可填写小写英文字母、数字，可使用的分隔符包括"_"、"-"、"."（分隔符不能在首位或末位)</p>
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
                <p class="form-tip-long">输入您的仓库的描述信息，长度限制为2-256个字符</p>
                <i-form-item label="仓库类型" prop="houseType">
                    <i-radio-group v-model="form.houseType" name="houseType">
                        <i-radio label="2">私有</i-radio>
                    </i-radio-group>
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
<style scoped src="./component-modal.less"></style>
