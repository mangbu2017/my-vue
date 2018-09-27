<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>RabbitMQ实例列表</h2>
        </div>
        <div class="page-toolbar">
            <div class="btn-wrap">
                <i-button type="primary" @click="handleCreateOpen">创建实例</i-button>
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
                    <th>实例ID</th>
                    <th>名称</th>
                    <th>状态</th>
                    <th>公网IP</th>
                    <th class="tai-table-cell-narrow">配置</th>
                    <th class="tai-table-cell-narrow">节点数量</th>
                    <th>存储容量</th>
                    <th>版本</th>
                    <th>创建时间</th>
                    <th class="tai-table-cell-narrow">操作</th>
                </tr>
            </thead>
            <tbody v-if="loading">
                <tr class="tai-table-tip">
                    <td colspan="10">
                        <i-spin>
                            <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                            <div>加载中...</div>
                        </i-spin>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="list.length">
                <tr v-for="item in list" :key="`${item.instanceID}`">
                    <td><router-link :to="`/ecs-rabbit/detail/${item.instanceID}`">{{ item.instanceID }}</router-link></td>
                    <td>{{ item.name }}</td>
                    <td><running-status :animate="true" :code="item.status" /></td>
                    <td v-if="item.isBoundPublic === 100" class="bind-loading">
                        <i-spin>
                            <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                        </i-spin>
                    </td>
                    <td v-else>
                        <span v-if="item.isBoundPublic === 1">{{ item.isBoundPublic | isBoundPublic }}</span>
                        <i-button v-else type="text" class="btn-operation" @click="handlebindIP(item)">申请</i-button>
                    </td>
                    <td>{{ item.flavor }}</td>
                    <td>{{ item.nodeNum | nodeNum }}</td>
                    <td>{{ item.disk }}GB</td>
                    <td>{{ item.version | version }}</td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleDeleteClick(item)">删除</i-button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="10">
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
        <create-modal
            v-if="isCreating"
            @on-success="handleCreateSuccess"
            @on-close="handleCreateClose"
        />
    </div>
</template>

<script src="./index.js"></script>
<style scoped src="./index.less"></style>
