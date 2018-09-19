<template>
    <div style="margin: 30px auto;">
        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>版本</th>
                    <th>Image ID</th>
                    <th class="tai-table-cell-narrow">仓库状态</th>
                    <th>Digest</th>
                    <th>镜像大小</th>
                    <th>最后更新时间</th>
                    <th class="tai-table-cell-narrow">操作</th>
                </tr>
            </thead>
            <tbody v-if="loading">
                <tr class="tai-table-tip">
                    <td colspan="7">
                        <i-spin>
                            <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                            <div>加载中...</div>
                        </i-spin>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="list.length">
                <tr v-for="(item, index) in list" :key="index">
                    <td>{{ item.version }}</td>
                    <td>{{ item.imageID }}</td>
                    <td>{{ item.statusDesc }}</td>
                    <td>{{ item.digest }}</td>
                    <td>{{ item.imageSizeDesc }}</td>
                    <td>{{ item.createTime ? (item.createTime | dtf('yyyy-MM-dd TT')) : '--' }}</td>
                    <td>
                        <i-button
                            type="text"
                            class="btn-operation"
                            @click="handleDeleteClick(item)"
                        >删除</i-button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="7">
                        暂无结果！
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

<script src="./version.js"></script>
<style scoped src="./version.less"></style>
