<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-tabs value="name1">
                <i-tab-pane label="实例详情" name="name1" />
            </i-tabs>
            <i-button
                v-try-back="{path: '/ecs-rabbit/:page(\\d+)?/:keyword?', fallback: '/ecs-rabbit'}"
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

        <div v-if="instance.instanceResponse" class="message-item">
            <div class="basic-title">基本信息</div>
            <table class="tai-table tai-table-border">
                <tbody>
                    <tr>
                        <td>实例ID</td>
                        <td>{{ $route.params.id }}</td>
                        <td>名称</td>
                        <td>{{ instance.instanceResponse.name }}</td>
                    </tr>
                    <tr>
                        <td>状态</td>
                        <td><running-status :animate="false" :code="instance.instanceResponse.status" /></td>
                        <td>配置</td>
                        <td>{{ instance.instanceResponse.flavor }}</td>
                    </tr>
                    <tr>
                        <td>节点数量</td>
                        <td>{{ instance.instanceResponse.nodeNum | nodeNum }}</td>
                        <td>存储容量</td>
                        <td>{{ instance.instanceResponse.disk }}GB</td>
                    </tr>
                    <tr>
                        <td>版本</td>
                        <td>{{ instance.instanceResponse.version | version }}</td>
                        <td>公网IP</td>
                        <td>{{ instance.instanceResponse.isBoundPublic | isBoundPublic }}</td>
                    </tr>
                    <tr>
                        <td>账号密码</td>
                        <td v-if="instance.instanceResponse.status === 1"><i-button type="primary" @click="handleGetLinkInfo">获取</i-button></td>
                        <td v-else><i-button type="default" disabled>获取</i-button></td>
                        <td>描述</td>
                        <td>{{ instance.instanceResponse.des ? instance.instanceResponse.des : '--' }}</td>
                    </tr>
                    <tr>
                        <td>创建时间</td>
                        <td>{{ instance.instanceResponse.createTime| dtf('yyyy-MM-dd TT') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance.instanceInfos" class="message-item">
            <div class="basic-title">节点连接信息</div>
            <table class="tai-table tai-table-border">
                <thead class="tai-table-header">
                    <tr>
                        <th>节点ID</th>
                        <th>内网地址</th>
                        <th>公网地址</th>
                        <th class="tai-table-cell-narrow">节点状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in instance.instanceInfos" :key="`${item.podID}`">
                        <td>{{ item.podID }}</td>
                        <td>{{ item.innerHost ? item.innerHost :'--' }}</td>
                        <td>{{ item.publicHost ? item.publicHost : '--' }}</td>
                        <td><running-status :animate="false" :code="item.status" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script src="./detail.js" />
<style scoped src="./detail.less" />
