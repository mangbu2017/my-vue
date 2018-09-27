<template>
    <div>

        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-if="instance.instanceDetail" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>实例名称</td>
                        <td>
                            <span>{{ instance.instanceDetail.name }}</span>
                            <i-icon class="icon-eye" type="md-create" @click="handleActivateEdit" />
                        </td>
                    </tr>
                    <tr>
                        <td>状态</td>
                        <td>{{ instance.instanceDetail.status }}</td>
                        <td>引擎版本</td>
                        <td>{{ instance.instanceDetail.version }}</td>
                    </tr>
                    <tr>
                        <td>存储类型</td>
                        <td>{{ instance.instanceDetail.storeType }}</td>
                        <td>架构类型</td>
                        <td>{{ instance.instanceDetail.frame }}</td>
                    </tr>
                    <tr>
                        <td>系列</td>
                        <td>{{ instance.instanceDetail.type }}</td>
                        <td>实例规格</td>
                        <td>{{ instance.instanceDetail.flavor }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.masterInfo" class="message-item">
            <div class="basic-title">主节点配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>内网地址</td>
                        <td>{{ instance.masterInfo.innerHost }}</td>
                        <td>集群地址</td>
                        <td>{{ instance.masterInfo.clusterHost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.slaveInfo" class="message-item">
            <div class="basic-title">从节点配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>内网地址</td>
                        <td>{{ instance.slaveInfo.innerHost }}</td>
                        <td>集群地址</td>
                        <td>{{ instance.slaveInfo.clusterHost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <update-modal
            v-if="update.status === 'ready'"
            :name="instance.instanceDetail.name"
            :status="update.status"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>
<script src="./overview.js" />
<style scoped src="./overview.less" />
