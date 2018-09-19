<template>
    <div class="detail-wrap">
        <div class="page-toolbar">
            <div class="btn-wrap">
                <i-button type="primary" @click="handleCreateDatabase">创建数据库</i-button>

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
                clearable
                enter-button
                placeholder="请输入数据库名称进行搜索"
                style="width: 300px"
                class="search-input"
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
                    <th>数据库名称</th>
                    <th>字符集</th>
                    <th>绑定账号</th>
                    <th>备注</th>
                    <th class="tai-table-cell-narrow">操作</th>
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
                <tr v-for="item in list" :key="`${item.databaseID}`">
                    <td class="tai-table-cell-center">
                        <i-checkbox
                            :value="item.checked"
                            class="checkbox"
                            @on-change="setIndexItemCheck({databaseID: item.databaseID, checked: $event})"
                        />
                    </td>
                    <td>{{ item.dbName }}</td>
                    <td>{{ item.charset }}</td>
                    <td>
                        {{ item.blindAccounts.length ? item.blindAccounts[0] : '--' }}
                        <i-tooltip
                            v-if="item.blindAccounts.length > 1"
                            theme="light"
                        >
                            <i-button type="text" class="btn-operation">更多</i-button>
                            <ul slot="content">
                                <li v-for="name in item.blindAccounts" :key="name.index">{{ name }}</li>
                            </ul>
                        </i-tooltip>
                    </td>
                    <td>{{ item.remark }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleBindOpen(item)">授权</i-button>
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

        <create-database
            v-if="isCreating"
            :instance = "insId"
            :bind="isBindOpen"
            @on-success="handleCreateSuccess"
            @on-close="handleCreateClose"
        />
        <transfer-modal
            v-if="isBindOpen"
            :list="userList"
            :status="bindStatus"
            title="绑定用户"
            @on-ok="handleBindOk"
            @on-cancel="handleBindCancel"
        >
            <div slot="aside">
                <i-button type="text" class="btn-aside" @click="handleBindCreate()">创建账号</i-button>
            </div>
        </transfer-modal>

        <create-account
            v-if="isCreatingAccount"
            :instance="insId"
            @on-success="handleCreateAccountSuccess"
            @on-close="handleCreateAccountClose"
        />
    </div>
</template>

<script src="./database.js"></script>
<style scoped src="./database.less"></style>
