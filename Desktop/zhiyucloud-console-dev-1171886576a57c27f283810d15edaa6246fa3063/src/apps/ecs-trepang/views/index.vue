<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>MongoDB实例列表</h2>
        </div>
        <div class="page-toolbar">
            <div class="btn-wrap">
                <i-button type="primary" @click="handleCreateOpen">创建实例</i-button>
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
                placeholder="请输入实例名称进行搜索"
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
                    <th>实例ID</th>
                    <th>名称</th>
                    <th class="tai-table-cell-narrow">状态</th>
                    <th class="tai-table-cell-narrow">规格</th>
                    <th>节点数</th>
                    <th>数据库版本</th>
                    <th class="tai-table-cell-narrow">创建人</th>
                    <th>创建时间</th>
                </tr>
            </thead>
            <tbody v-if="loading">
                <tr class="tai-table-tip">
                    <td colspan="9">
                        <i-spin>
                            <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                            <div>加载中...</div>
                        </i-spin>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="list.length">
                <tr v-for="item in list" :key="`${item.instanceID}-${item.updateDate}`">
                    <td class="tai-table-cell-center">
                        <i-checkbox
                            :value="item.checked"
                            class="checkbox"
                            @on-change="setIndexItemCheck({instanceID: item.instanceID, checked: $event})"
                        />
                    </td>
                    <td><router-link :to="`/ecs-trepang/detail/${item.instanceID}`">{{ item.instanceID }}</router-link></td>
                    <td>
                        {{ item.name }}
                        <i-icon
                            class="icon-eye"
                            type="md-create"
                            @click="handleUpdateName(item)"
                        />
                    </td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.flavor }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.version }}</td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="9">
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
        <create-modal
            v-if="isCreating"
            @on-success="handleCreateSuccess"
            @on-close="handleCreateClose"
        />
        <update-modal
            v-if="update.item"
            :name="update.item.name"
            :status="update.status"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>

<script src="./index.js"></script>
<style scoped src="./index.less"></style>
