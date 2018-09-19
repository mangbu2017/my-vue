<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>命名空间</h2>
        </div>
        <div class="page-toolbar">
            <i-button type="primary" @click="handleCreateOpen">创建命名空间</i-button>
        </div>

        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>命名空间</th>
                    <th>权限</th>
                    <th>命名空间状态</th>
                    <th class="tai-table-cell-narrow">创建人</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody v-if="loading">
                <tr class="tai-table-tip">
                    <td colspan="6">
                        <i-spin>
                            <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                            <div>加载中...</div>
                        </i-spin>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="list.length">
                <tr v-for="item in list" :key="`${item.nameSpaceID}`">
                    <td>{{ item.nameSpace }}</td>
                    <td>{{ item.authDesc }}</td>
                    <td>{{ item.statusDesc }}</td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleDeleteClick(item)">删除</i-button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="6">
                        暂无结果！
                    </td>
                </tr>
            </tbody>
        </table>
        <create-modal
            v-if="isCreating"
            @on-success="handleCreateSuccess"
            @on-close="handleCreateClose"
        />
        <init-password
            v-if="isInitSetting"
            @on-ok="handleInitPasswordModalOk"
            @on-close="handleInitPasswordModalCancel"
        />
    </div>
</template>
<script src="./index.js"></script>
<style scoped src="./index.less"></style>
