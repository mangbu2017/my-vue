<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>ECS实例列表</h2>
        </div>
        <div class="page-toolbar">
            <div class="btn-wrap">
                <i-button type="primary" to="/ecs-seabed/create">创建实例</i-button>
                <i-dropdown style="margin-left: 20px" @on-click="handleDropdownClick">
                    <i-button type="primary">
                        更多操作
                        <i-icon type="ios-arrow-down" />
                    </i-button>
                    <i-dropdown-menu slot="list">
                        <i-dropdown-item
                            :disabled="btnDisabled"
                            name="start"
                        >启动</i-dropdown-item>
                        <i-dropdown-item
                            :disabled="btnDisabled"
                            name="restart"
                        >重启</i-dropdown-item>
                        <i-dropdown-item
                            :disabled="btnDisabled"
                            name="stop"
                        >关机</i-dropdown-item>
                        <i-dropdown-item
                            :disabled="btnDisabled"
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
                    <th>IP地址</th>
                    <th class="tai-table-cell-narrow">状态</th>
                    <th>配置</th>
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
                <tr v-for="item in list" :key="`${item.instanceID}-${item.updateDate}`">
                    <td class="tai-table-cell-center">
                        <i-checkbox
                            :value="item.checked"
                            class="checkbox"
                            @on-change="setIndexItemCheck({instanceID: item.instanceID, checked: $event})"
                        />
                    </td>
                    <td><router-link :to="`/ecs-seabed/detail/${item.instanceID}`">{{ item.instanceID }}</router-link></td>
                    <td>
                        {{ item.name }}
                        <i-icon
                            class="icon"
                            type="md-create"
                            @click="handleUpdateName(item)"
                        />
                    </td>
                    <td>
                        公网IP:
                        <span v-if="item.publicIP !== '--'">
                            {{ item.publicIP }}
                            <i-icon
                                v-if="item.ipLoading"
                                class="loading-spin-icon-load"
                                type="ios-loading"
                            />
                            <i-icon
                                v-else
                                class="icon"
                                type="md-pause"
                                @click="handleUnbindIP(item)"
                            />
                        </span>
                        <span v-else-if="item.status !== '创建中'">
                            <i-button
                                :loading="item.ipLoading"
                                :disabled="item.ipLoading"
                                shape="circle"
                                size="small"
                                type="primary"
                                @click="handleBindIP(item)"
                            >
                                绑定
                            </i-button>
                        </span>
                        <span v-else>
                            {{ item.publicIP }}
                        </span>
                        <br>
                        私网IP: {{ item.innerIP || '-' }}
                    </td>
                    <td>{{ item.status }}</td>
                    <!--<td><running-status :code="item.status" /></td>-->
                    <td>{{ item.configuration }}</td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.createTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleCreateOpen(item)">创建镜像</i-button>
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
        <create-image
            v-if="isCreating"
            :name="createImage.instanceName"
            :id="createImage.instanceID"
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
