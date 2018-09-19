<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-if="instance.echinusInstance" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>实例名称</td>
                        <td>
                            <span>{{ instance.echinusInstance.instanceName }}</span>
                            <i-icon class="icon-eye" type="md-create" @click="handleActivateEdit" />
                        </td>
                    </tr>
                    <tr>
                        <td>状态</td>
                        <td>{{ instance.echinusInstance.status }}</td>
                        <td>规格</td>
                        <td>{{ instance.echinusInstance.flavor }}</td>
                    </tr>
                    <tr>
                        <td>可用区</td>
                        <td>{{ instance.echinusInstance.region }}</td>
                        <td>创建时间</td>
                        <td>{{ instance.echinusInstance.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.info" class="message-item">
            <div class="basic-title">配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>内网地址(host)</td>
                        <td>{{ instance.info.host }}</td>
                        <td>集群地址</td>
                        <td>{{ instance.info.cluster }}</td>
                    </tr>
                    <tr>
                        <td>用户名</td>
                        <td>{{ instance.info.userName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <update-modal
            v-if="update.status === 'ready'"
            :name="instance.echinusInstance.instanceName"
            :status="update.status"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>
<script src="./overview.js" />
<style scoped src="./overview.less" />
