<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-if="instance" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tr>
                    <td>实例ID</td>
                    <td>{{ $route.params.id }}</td>
                    <td>实例名称</td>
                    <td>
                        <span>{{ instance.name }}</span>
                        <i-icon class="icon-eye" type="md-create" @click="handleActivateEdit" />
                    </td>
                </tr>
                <tr>
                    <td>存储类型</td>
                    <td>{{ instance.storeType }}</td>
                    <td>系列</td>
                    <td>{{ instance.type }}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>{{ instance.status }}</td>
                    <td>创建时间</td>
                    <td>{{ instance.createTime | dtf('yyyy-MM-dd TT') }}</td>
                </tr>
                <tr>
                    <td>只读内网地址</td>
                    <td>{{ instance.innerReadHost }}</td>
                    <td>读写内网地址</td>
                    <td>{{ instance.innerWriteHost }}</td>
                </tr>
                <tr>
                    <td>只读公网地址</td>
                    <td>{{ instance.publicReadHost }}</td>
                    <td>读写公网地址</td>
                    <td>{{ instance.publicWriteHost }}</td>
                </tr>
            </table>
        </div>

        <div v-if="instance" class="message-item">
            <div class="basic-title">配置信息</div>
            <table class="tai-table tai-table-border">
                <tr>
                    <td>规格族</td>
                    <td>{{ instance.spceType }}</td>
                    <td>数据库类型</td>
                    <td>{{ instance.version }}</td>
                </tr>
                <tr>
                    <td>CPU</td>
                    <td>{{ instance.cpuNumsDesc }}</td>
                    <td>数据库内存</td>
                    <td>{{ instance.memSizeDesc }}</td>
                </tr>
                <tr>
                    <td>配置</td>
                    <td>{{ instance.conf }}</td>
                </tr>
            </table>
        </div>
        <div v-if="instance" class="message-item">
            <div class="basic-title">存储空间</div>
            <table class="tai-table tai-table-border">
                <tr>
                    <td>总存储空间</td>
                    <td>{{ instance.totalStoreSizeDesc }}</td>
                    <td>已使用空间</td>
                    <td>{{ instance.usedStoreSizeDesc }}</td>
                </tr>
            </table>
        </div>

        <update-modal
            v-if="update.status === 'ready'"
            :name="instance.name"
            :status="update.status"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>
<script src="./overview.js" />
<style src="./overview.less" />
