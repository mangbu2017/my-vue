<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-if="instance.mongodbInstance" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>实例名称</td>
                        <td>
                            <span>{{ instance.mongodbInstance.name }}</span>
                            <i-icon class="icon-eye" type="md-create" @click="handleActivateEdit" />
                        </td>
                    </tr>
                    <tr>
                        <td>地域</td>
                        <td>{{ instance.mongodbInstance.region }}</td>
                        <td>规格</td>
                        <td>{{ instance.mongodbInstance.flavor }}</td>
                    </tr>
                    <tr>
                        <td>磁盘空间</td>
                        <td>{{ instance.mongodbInstance.disk }}</td>
                        <td>创建时间</td>
                        <td>{{ instance.mongodbInstance.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.account" class="message-item">
            <div class="basic-title">账号管理</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>账号名</td>
                        <td colspan="3">{{ instance.account.user }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.node1" class="message-item">
            <div class="basic-title">连接信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>版本</td>
                        <td>{{ instance.mongodbInstance.version }}</td>
                        <td>副本集名称</td>
                        <td>{{ instance.mongodbInstance.name }}</td>
                    </tr>
                    <tr>
                        <td>节点1(内网地址)</td>
                        <td>{{ instance.node1.innerHost }}</td>
                        <td>节点1(集群地址)</td>
                        <td>{{ instance.node1.clusterHost }}</td>
                    </tr>
                    <tr v-if="instance.node2">
                        <td>节点2(内网地址)</td>
                        <td>{{ instance.node2.innerHost }}</td>
                        <td>节点2(集群地址)</td>
                        <td>{{ instance.node2.clusterHost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.useInfo" class="message-item">
            <div class="basic-title">实用信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td style="color: #bbb;">客户端使用Connection StringURL连接实例（***部分替换为root密码）
                            <span style="color: red;">请使用MongoDB 3.0以上版本的driver</span>
                        </td>
                    </tr>
                    <tr>
                        <td>{{ instance.useInfo.client }}</td>
                    </tr>
                    <tr>
                        <td style="color: #bbb;">使用Mongo Shell连接实例
                            <span style="color: red;">请使用MongoDB 3.0以上版本的driver</span>
                        </td>
                    </tr>
                    <tr>
                        <td>{{ instance.useInfo.shell1 }}</td>
                    </tr>
                    <tr v-if="instance.useInfo.shell2">
                        <td>{{ instance.useInfo.shell2 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <update-modal
            v-if="update.status === 'ready'"
            :name="instance.mongodbInstance.name"
            :status="update.status"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>
<script src="./overview.js" />
<style scoped src="./overview.less" />
