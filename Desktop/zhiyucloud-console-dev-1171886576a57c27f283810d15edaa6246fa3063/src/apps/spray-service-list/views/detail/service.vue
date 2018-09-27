<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>
        <div v-else>
            <div class="message-item">
                <div class="basic-title">详情</div>
                <table class="tai-table tai-table-border">
                    <tbody>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">名称</th>
                            <td>{{ details.name | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">命名空间</th>
                            <td>{{ details.namespace | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">创建时间</th>
                            <td>{{ details.creationTime | dtf('yyyy-MM-dd TT') }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">标签选择器</th>
                            <td>{{ details.labelsSelector | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">类型</th>
                            <td>{{ details.type | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">亲和</th>
                            <td>{{ details.sessionAffinity | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">节点端口</th>
                            <td>{{ details.nodePort | valShow }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">连接</th>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">集群IP</th>
                            <td>{{ details.clusterIp }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">内部端点</th>
                            <td>{{ details.InternalEndpointers | arrShow }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script src="./service.js" />

<style scoped src="./detail.less" />
