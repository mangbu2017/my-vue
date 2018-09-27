<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>自定义镜像列表</h2>
        </div>

        <div class="page-toolbar">
            <i-input
                v-model="keyword"
                search
                type="text"
                icon
                clearable
                enter-button
                placeholder="请输入镜像名称进行搜索"
                style="width: 300px"
                class="search-input"
                @on-search="handleSearch"
            />
        </div>
        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>镜像ID</th>
                    <th>镜像名称</th>
                    <th>操作系统</th>
                    <th class="tai-table-cell-narrow">镜像容量</th>
                    <th>所属实例</th>
                    <th>所属实例ID</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
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
                <tr v-for="item in list" :key="`${item.imageID}`">
                    <td>{{ item.imageID }}</td>
                    <td>{{ item.imageName }}</td>
                    <td>{{ item.systemType }}</td>
                    <td>{{ item.imageSize }}GB</td>
                    <td>{{ item.instanceName }}</td>
                    <td>{{ item.instanceID }}</td>
                    <td><running-status :code="item.status" /></td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleDeleteClick(item)">删除</i-button>
                        <!--<i-button type="text" class="btn-operation" @click="handleDeleteClick(item)">创建虚拟主机</i-button>-->
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="tai-table-tip">
                    <td colspan="9">
                        暂无结果！
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script src="./index.js"></script>
<style scoped src="./index.less"></style>
