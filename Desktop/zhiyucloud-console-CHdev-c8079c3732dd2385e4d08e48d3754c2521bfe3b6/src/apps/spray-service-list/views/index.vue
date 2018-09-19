<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>服务</h2>
        </div>
        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>服务名称</th>
                    <th width="7%">状态</th>
                    <th width="8%">副本数</th>
                    <th width="12%">创建时长</th>
                    <th width="30%">镜像</th>
                    <th width="10%">创建人</th>
                    <th width="12%">操作</th>
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
                <tr v-for="item in list" :key="`${item.applicationID}-${item.updateDate}`">
                    <td><router-link :to="`/spray-service-list/detail/${item.applicationID}`">{{ item.applicationName }}</router-link></td>
                    <td class="tai-table-cell-center">{{ item.status | statusType }}</td>
                    <td class="tai-table-cell-center">{{ item.replicates }}</td>
                    <td>{{ item.firstCreateDateTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>{{ item.images }}</td>
                    <td>{{ item.creator }}</td>
                    <td>
                        <i-button
                            type="text"
                            class="btn-operation"
                            @click="handleDelete(item)"
                        >
                            delete
                        </i-button>
                        <i-button
                            type="text"
                            class="btn-operation"
                            @click="editConfig(item)"
                        >
                            edit
                        </i-button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="7">
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
<script src="./index.js"></script>
<style scoped src="./index.less"></style>
