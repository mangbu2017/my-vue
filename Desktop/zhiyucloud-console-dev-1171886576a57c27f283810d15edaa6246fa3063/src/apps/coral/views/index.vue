<template>
    <div class="content-wrap">
        <div class="page-title">
            <h2>日志服务</h2>
        </div>
        <div class="page-toolbar">
            <i-form
                ref="form"
                :model="form"
                :label-width="80"
                @submit.native.prevent="handleSubmit"
            >
                <i-form-item label="起止时间" prop="dateTime">
                    <i-datePicker
                        v-model="form.dateTime"
                        type="datetimerange"
                        placeholder="Select date and time"
                        style="width: 280px"
                        @on-change="handleDateChange"
                    />
                </i-form-item>
                <i-form-item label="关键字" prop="keywords">
                    <i-input v-model="form.keywords" placeholder="请输入关键字" style="width: 280px" />
                </i-form-item>
                <i-form-item label="主机地址" prop="endpoint">
                    <i-input v-model="form.endpoint" placeholder="请输入主机地址" style="width: 280px" />
                </i-form-item>
                <i-form-item style="width: 240px;">
                    <i-button type="primary" @click="handleSubmit">查询</i-button>
                    <i-button style="margin-left: 30px" @click="handleReset('form')">重置</i-button>
                </i-form-item>
            </i-form>
        </div>

        <div class="alert-box">
            共有<span>{{ list.length }}</span>条记录
        </div>

        <table class="tai-table tai-table-border tai-table-hover">
            <thead class="tai-table-header">
                <tr>
                    <th>名称</th>
                    <th>关键字</th>
                    <th class="tai-table-cell-narrow">相关度</th>
                    <th>主机地址</th>
                    <th>更新时间</th>
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
                <tr v-for="item in list" :key="`${item.id}`">
                    <td>{{ item.indexName }}</td>
                    <td>{{ item.msgAbbr }}</td>
                    <td>{{ item.score }}</td>
                    <td>{{ item.host }}</td>
                    <td>{{ item.updateTime | dtf('yyyy-MM-dd TT') }}</td>
                    <td>
                        <i-button type="text" class="btn-operation" @click="handleDetailClick(item)">详情</i-button>
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
        <div v-if="page.total > page.size & !loading" class="page">
            <i-page
                :total="page.total"
                :page-size="page.size"
                :current="page.current"
                @on-change="handlePageChange"
            />
        </div>
        <detail-modal
            v-if="isDetailing"
            :name="detail.name"
            :id="detail.id"
            @on-close="handleDetailCancel"
        />
    </div>
</template>
<script src="./index.js"></script>
<style scoped src="./index.less"></style>
