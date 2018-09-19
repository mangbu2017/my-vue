<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-tabs value="name1">
                <i-tab-pane label="实例详情" name="name1" />
            </i-tabs>
            <i-button
                v-try-back="{path: '/ecs-seahare/:page(\\d+)?/:keyword?', fallback: '/ecs-seahare'}"
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

        <div v-if="instance.ecsredisInstanceTmp" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>实例名称</td>
                        <td>
                            <span>{{ instance.ecsredisInstanceTmp.name }}</span>
                            <i-icon class="icon-eye" type="md-create" @click="handleActivateEdit" />
                        </td>
                    </tr>
                    <tr>
                        <td>状态</td>
                        <td>{{ instance.ecsredisInstanceTmp.status }}</td>
                        <td>引擎版本</td>
                        <td>{{ instance.ecsredisInstanceTmp.version }}</td>
                    </tr>
                    <tr>
                        <td>存储类型</td>
                        <td>{{ instance.ecsredisInstanceTmp.storeType }}</td>
                        <td>架构类型</td>
                        <td>{{ instance.ecsredisInstanceTmp.frame }}</td>
                    </tr>
                    <tr>
                        <td>系列</td>
                        <td>{{ instance.ecsredisInstanceTmp.type }}</td>
                        <td>内存</td>
                        <td>{{ instance.ecsredisInstanceTmp.flavor }}</td>
                    </tr>
                    <tr>
                        <td>存储空间</td>
                        <td>{{ instance.ecsredisInstanceTmp.disk }}</td>
                        <td>公网IP</td>
                        <td>{{ instance.ecsredisInstanceTmp.isBoundPublic }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.fatherInfo" class="message-item">
            <div class="basic-title">主节点配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>内网地址</td>
                        <td>{{ instance.fatherInfo.innerHost }}</td>
                        <td>公网地址</td>
                        <td>{{ instance.fatherInfo.publicHost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.sonInfo" class="message-item">
            <div class="basic-title">从节点配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>内网地址</td>
                        <td>{{ instance.sonInfo.innerHost }}</td>
                        <td>公网地址</td>
                        <td>{{ instance.sonInfo.publicHost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="instance.myRdeisInfo" class="message-item">
            <div class="basic-title">节点配置信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>内网地址</td>
                        <td>{{ instance.myRdeisInfo.innerHost }}</td>
                        <td>公网地址</td>
                        <td>{{ instance.myRdeisInfo.publicHost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <update-modal
            v-if="update.status === 'ready'"
            :name="instance.ecsredisInstanceTmp.name"
            :status="update.status"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>
<script src="./detail.js" />
<style scoped src="./detail.less" />
