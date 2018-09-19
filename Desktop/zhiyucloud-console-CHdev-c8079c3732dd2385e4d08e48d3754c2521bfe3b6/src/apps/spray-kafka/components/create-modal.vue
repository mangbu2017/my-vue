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
                <i-form-item label="实例名称" prop="name">
                    <i-input v-model="form.name" name="name" placeholder="请输入实例名称" style="width: 300px" />
                    <span class="form-tip form-tip-name">支持中文、字母、数字以及_，长度限制<br>为1-64个字符</span>
                </i-form-item>
                <i-form-item label="版本" prop="version">
                    <i-radio-group v-model="form.version" name="version">
                        <i-radio label="0">Kafka 4.0</i-radio>
                    </i-radio-group>
                </i-form-item>
                <i-form-item label="CPU" prop="cpuSize">
                    <i-select v-model="form.cpuSize" name="cpuSize" style="width:300px">
                        <i-option v-for="item in cpuSize" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item label="内存" prop="memSize">
                    <i-select v-model="form.memSize" name="memSize" style="width:300px">
                        <i-option v-for="item in memSize" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item label="节点数量" prop="nodeNum">
                    <i-input-number :max="10" :min="1" v-model="form.nodeNum" name="nodeNum" />
                    <span class="form-tip-number">最多可开通10个节点，开通后可再次添加节点</span>
                </i-form-item>
                <i-form-item label="存储空间" prop="disk">
                    <i-slider
                        v-model="form.disk"
                        :min="10"
                        :max="500"
                        name="disk"
                        show-tip="hover"
                        show-input
                        style="width: 280px"
                    />
                    <span class="min-size">10GB</span>
                    <span class="max-size">500GB</span>
                    <span class="item-unit">GB</span>
                    <span class="ram-tip">存储空间10GB～500GB</span>
                </i-form-item>
                <i-form-item label="ZooKeeper节点数" prop="zookeeperNum">
                    <i-input-number :max="3" :min="1" v-model="form.zookeeperNum" name="zookeeperNum" />
                    <span class="form-tip-number">最多可开通3个节点</span>
                </i-form-item>
                <i-form-item label="描述" prop="des">
                    <i-input
                        v-model="form.des"
                        :autosize="{minRows: 4,maxRows: 4}"
                        name="des"
                        type="textarea"
                        placeholder="请输入描述信息"
                        style="width: 300px"
                    />
                    <span class="form-tip form-tip-name">请输入kafka服务描述信息，<br>长度最长为100个字符</span>
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

