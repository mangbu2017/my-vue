<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>镜像仓库列表</h2>
        </div>
        <div class="page-toolbar">
            <div class="btn-wrap">
                <i-button type="primary" @click="handleCreateOpen">创建镜像仓库</i-button>
                <i-button style="margin: 0 10px 0 20px" type="primary" @click="handleLoginPWOpen">修改登录密码</i-button>
                <div style="display: inline-block;line-height: 32px;margin: 0 5px;">命名空间筛选</div>
                <i-select v-model="namespace" clearable style="width:200px" @on-change="changeNameSpace(namespace)">
                    <i-option v-for="item in namespaceList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <i-input
                v-model="keyword"
                search
                type="text"
                icon
                enter-button
                placeholder="请输入仓库名称进行搜索"
                style="width: 300px"
                @on-search="handleSearch"
            />
        </div>

        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>仓库名称</th>
                    <th>命名空间</th>
                    <th class="tai-table-cell-narrow">仓库状态</th>
                    <th class="tai-table-cell-narrow">性质</th>
                    <th class="tai-table-cell-narrow">权限</th>
                    <th>仓库地址</th>
                    <th class="tai-table-cell-narrow">创建人</th>
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
                <tr v-for="item in list" :key="`${item.wareHouseID}`">
                    <td>{{ item.wareHouseName ? item.wareHouseName : '--' }}</td>
                    <td>{{ item.nameSpace ? item.nameSpace : '--' }}</td>
                    <td>{{ item.statusDesc ? item.statusDesc : '--' }}</td>
                    <td>{{ item.houseTypeDesc ? item.houseTypeDesc : '--' }}</td>
                    <td>{{ item.authDesc ? item.authDesc : '--' }}</td>
                    <td>{{ item.publicUrl ? item.publicUrl : '--' }}</td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button
                            :to="`/spray-warehouse/detail/${item.wareHouseID}`"
                            type="text"
                            class="btn-operation"
                        >管理</i-button>
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
                    <td colspan="9">
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
        <update-login
            v-if="isUpdating"
            @on-ok="handleUpdateModalOk"
            @on-close="handleUpdateModalCancel"
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
