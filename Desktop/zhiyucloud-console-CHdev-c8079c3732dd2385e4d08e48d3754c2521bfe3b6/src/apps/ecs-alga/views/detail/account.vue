<template>
    <div class="content-wrap">
        <div class="page-toolbar">
            <div class="btn-wrap">
                <i-button type="primary" @click="handleCreateAccountOpen">创建账号</i-button>

                <i-dropdown style="margin-left: 20px" @on-click="handleDropdownClick">
                    <i-button type="primary">
                        更多操作
                        <i-icon type="ios-arrow-down" />
                    </i-button>
                    <i-dropdown-menu slot="list">
                        <i-dropdown-item
                            :disabled="btnDeleteDisabled"
                            name="delete"
                        >删除</i-dropdown-item>
                    </i-dropdown-menu>
                </i-dropdown>
            </div>
            <i-input
                v-model="keyword"
                search
                type="text"
                icon
                enter-button
                placeholder="请输入账号名称进行搜索"
                style="width: 300px"
                @on-search="handleSearch"
            />
        </div>
        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th class="tai-table-cell-narrower">
                        <i-checkbox
                            :value="allChecked"
                            class="checkbox"
                            @on-change="setIndexAllItemCheck({ checked: $event })"
                        />
                    </th>
                    <th>账号</th>
                    <th class="tai-table-cell-narrow">状态</th>
                    <th>绑定数据库</th>
                    <th>账号描述</th>
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
                <tr v-for="item in list" :key="`${item.accountID}-${item.dbAccount}`">
                    <td class="tai-table-cell-center">
                        <i-checkbox
                            :value="item.checked"
                            class="checkbox"
                            @on-change="setIndexItemCheck({accountID: item.accountID, checked: $event})"
                        />
                    </td>
                    <td>{{ item.dbAccount }}</td>
                    <td>{{ item.accountStatus }}</td>
                    <td>
                        {{ item.dbName.length ? item.dbName[0] : '--' }}
                        <i-tooltip
                            v-if="item.dbName.length > 1"
                            theme="light"
                        >
                            <i-button type="text" class="btn-operation">更多</i-button>
                            <ul slot="content">
                                <li v-for="name in item.dbName" :key="name.index">{{ name }}</li>
                            </ul>
                        </i-tooltip>
                    </td>
                    <td>{{ item.accountDesc }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleBindOpen(item)">授权</i-button>
                        <i-button type="text" class="btn-operation" @click="handleUpdatePassword(item)">重置密码</i-button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="6">
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
        <create-account
            v-if="isCreating"
            :instance="insId"
            @on-success="handleCreateSuccess"
            @on-close="handleCreateClose"
        />
        <update-password
            v-if="isUpdating"
            :name="update.item.dbAccount"
            :account="update.item.accountID"
            :instance="insId"
            @on-ok="handleUpdatePasswordOk"
            @on-close="handleUpdatePasswordCancel"
        />
        <transfer-modal
            v-if="isBindOpen"
            :list="dbList"
            :status="bindStatus"
            title="数据库授权"
            @on-ok="handleBindOk"
            @on-cancel="handleBindCancel"
        />
    </div>
</template>
<script src="./account.js"></script>
<style scoped src="./account.less"></style>
