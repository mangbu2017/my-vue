<template>
    <div>

        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-if="instance.instanceResponse" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>实例名称</td>
                        <td>{{ instance.instanceResponse.name }}</td>
                    </tr>
                    <tr>
                        <td>配置</td>
                        <td>{{ instance.instanceResponse.flavor }}</td>
                        <td>版本</td>
                        <td>{{ instance.instanceResponse.version }}</td>
                    </tr>
                    <tr>
                        <td>节点数量</td>
                        <td>{{ instance.instanceResponse.nodeNum }}</td>
                        <td>ZooKeeper节点数</td>
                        <td>{{ instance.instanceResponse.zookeeperNum }}</td>
                    </tr>
                    <tr>
                        <td>存储空间</td>
                        <td>{{ instance.instanceResponse.disk }}</td>
                        <td>创建时间</td>
                        <td>{{ instance.instanceResponse.createTime| dtf('yyyy-MM-dd TT') }}</td>
                    </tr>
                    <tr>
                        <td>描述</td>
                        <td>{{ instance.instanceResponse.des }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.instanceInfos" class="message-item">
            <div class="basic-title">节点连接信息</div>
            <table class="tai-table tai-table-border">
                <thead class="tai-table-header">
                    <tr>
                        <th>节点ID</th>
                        <th>内网地址</th>
                        <th>集群地址</th>
                        <th class="tai-table-cell-narrow">节点状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in instance.instanceInfos" :key="`${item.podID}`">
                        <td>{{ item.podID }}</td>
                        <td>{{ item.innerHost }}</td>
                        <td>{{ item.clusterHost }}</td>
                        <td>{{ item.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script src="./overview.js" />
<style scoped src="./overview.less" />
