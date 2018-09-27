<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-else>
            <div class="charts-wrap">
                <blank-iframe v-if="url" :url="url" />
            </div>

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
                            <th class="tai-table-cell-narrow tai-table-cell-right">标签</th>
                            <td>{{ details.labels | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">附注</th>
                            <td>{{ details.annotations | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">创建时间</th>
                            <td>{{ details.creationTime }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">选择器</th>
                            <td>{{ details.selector | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">状态</th>
                            <td>{{ details.status | valShow }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script src="./deployment.js" />

<style scoped src="./detail.less" />
