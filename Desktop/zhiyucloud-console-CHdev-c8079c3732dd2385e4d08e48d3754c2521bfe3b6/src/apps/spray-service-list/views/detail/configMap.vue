<template>
    <div>
        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>名称</th>
                    <th>命名空间</th>
                    <th>创建时间</th>
                    <th width="12%">操作</th>
                </tr>
            </thead>
            <tbody v-if="loading">
                <tr class="tai-table-tip">
                    <td colspan="4">
                        <i-spin>
                            <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                            <div>加载中...</div>
                        </i-spin>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="list.length">
                <tr v-for="item in list" :key="`${item.applicationID}-${item.updateDate}`">
                    <td>{{ item.configMapName }}</td>
                    <td>{{ item.nameSpace }}</td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button
                            type="text"
                            class="btn-operation"
                            @click="checkConfig(item)"
                        >
                            详情
                        </i-button>
                        <i-button
                            type="text"
                            class="btn-operation"
                            @click="handleDelete(item)"
                        >
                            删除
                        </i-button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="4">
                        暂无查询结果！
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="page.total > page.size & !loading" class="page">
            <i-page
                :total="page.total"
                :page-size="page.size"
                :current="page.current"
                @on-change="handlePageChange"
            />
        </div>
    </div>
</template>

<script src="./configmap.js"></script>

<style scoped src="../index.less"></style>
