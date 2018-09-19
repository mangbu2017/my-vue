<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-tabs value="name1">
                <i-tab-pane label="实例详情" name="name1" />
            </i-tabs>
            <i-button
                v-try-back="{path: '/ecs-seabed/:page(\\d+)?/:keyword?', fallback: '/ecs-seabed'}"
                class="return-list"
                type="primary"
            >返回实例列表</i-button>
        </div>

        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>名称</td>
                        <td>
                            <span>{{ instance.name }}</span>
                            <i-icon class="icon-eye" type="md-create" @click="handleActivateEdit" />
                        </td>
                    </tr>
                    <tr>
                        <td>地域</td>
                        <td>{{ instance.region }}</td>
                        <td>实例规格名称</td>
                        <td>{{ instance.flavorName }}</td>
                    </tr>
                    <tr>
                        <td>实例规格族</td>
                        <td>{{ instance.group }}</td>
                        <td>镜像ID</td>
                        <td>{{ instance.imageID }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="message-item">
            <div class="basic-title">配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>CPU</td>
                        <td>{{ instance.cpu }}</td>
                        <td>内存</td>
                        <td>{{ instance.mem }} </td>
                    </tr>
                    <tr>
                        <td>操作系统</td>
                        <td>{{ instance.system }}</td>
                        <td>公网IP</td>
                        <td>{{ instance.publicIP }}</td>
                    </tr>
                    <tr>
                        <td>内网IP</td>
                        <td>{{ instance.innerIP }}</td>
                        <td>当前使用带宽</td>
                        <td>{{ instance.bandwidth }}</td>
                    </tr>
                    <tr>
                        <td>系统盘容量</td>
                        <td>{{ instance.sysDiskSize }}</td>
                        <td>数据盘容量</td>
                        <td>{{ instance.disk }}</td>
                    </tr>
                    <tr>
                        <td>数据盘数量</td>
                        <td>{{ instance.diskNum }}</td>
                    </tr>
                </tbody>
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
<script src="./detail.js" />
<style scoped src="./detail.less" />
