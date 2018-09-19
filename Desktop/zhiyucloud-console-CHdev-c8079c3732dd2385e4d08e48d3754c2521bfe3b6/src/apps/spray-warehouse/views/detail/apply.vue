<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>部署应用</h2>
            <i-button
                :to="`/spray-warehouse/detail/${$route.params.id}`"
                type="primary"
                class="return-list"
            >返回镜像基本信息</i-button>
        </div>
        <i-steps :current="current">
            <i-step title="应用基本信息">
                <div v-if="current === 0">
                    <i-form
                        v-timely-validate
                        ref="form"
                        :model="form"
                        :rules="formRules"
                        :label-width="100"
                        @submit.native.prevent="handleNext"
                    >
                        <i-form-item label="应用名称" prop="applicationName">
                            <i-input
                                v-model="form.applicationName"
                                name="applicationName"
                                placeholder="请输入应用名称"
                                style="width: 300px"
                            />
                            <span class="form-tip form-tip-name">名称为1-64个字符，可包含数字、英文字符，或 “ - ”，且不能以 - 开头</span>
                        </i-form-item>
                        <i-form-item label="应用描述" prop="remark">
                            <i-input
                                v-model="form.remark"
                                :autosize="{minRows: 5,maxRows: 5}"
                                name="remark"
                                type="textarea"
                                placeholder="请输入应用描述"
                                style="width: 300px"
                            />
                            <span class="form-tip form-tip-name">输入您的仓库的描述信息，长度最长为100个字符</span>
                        </i-form-item>
                    </i-form>
                    <div class="step1-opration">
                        <i-button
                            :to="`/spray-warehouse/detail/${$route.params.id}`"
                            type="primary"
                            style="margin-right: 20px;"
                        >返回</i-button>
                        <i-button type="default" @click="handleNext">下一步</i-button>
                    </div>
                </div>
            </i-step>
            <i-step title="模板编辑">
                <div v-if="current === 1" class="step2-opration">
                    <codemirror v-model="code" :options="cmOptions" />
                    <div class="btn-step2">
                        <i-button
                            :disabled="status === 'request'"
                            type="default"
                            style="margin-right: 20px;"
                            @click="handlePre"
                        >上一步</i-button>
                        <i-button
                            :loading="status === 'request'"
                            type="primary"
                            @click="handleApply"
                            @on-enter="handleApply"
                        >
                            <span v-if="status !== 'request'">部署</span>
                            <span v-else>提交中...</span>
                        </i-button>
                    </div>
                </div>
            </i-step>
            <i-step title="创建成功">
                <div v-if="current === 2" class="step3-opration">
                    <p>恭喜您完成部署，完成创建！</p>
                    <i-button :to="`/spray-service-list/`" type="primary">查看服务列表</i-button>
                </div>
            </i-step>
        </i-steps>
    </div>
</template>
<script src="./apply.js"></script>
<style src="./apply.less"></style>
