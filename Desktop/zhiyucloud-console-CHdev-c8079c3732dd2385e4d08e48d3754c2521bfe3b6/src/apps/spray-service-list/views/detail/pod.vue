<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>
        <div v-else>
            <div class="charts-wrap">
                <blank-iframe v-if="url" :url="url" />
            </div>

            <div class="message-item">
                <div class="basic-title">详情</div>
                <table class="tai-table tai-table-border">
                    <tbody>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">Name</th>
                            <td>{{ details.name }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">Namespace</th>
                            <td>{{ details.namespace }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">标签</th>
                            <td>{{ details.labels }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">附注</th>
                            <td>{{ details.annotations }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">创建时间</th>
                            <td>{{ details.creationTime | dtf('yyyy-MM-dd TT') }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">状态</th>
                            <td>{{ details.status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="message-item">
                <div class="basic-title">容器</div>
                <table class="tai-table tai-table-border">
                    <tbody>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">Name</th>
                            <td>{{ containers.name | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">Image</th>
                            <td>{{ containers.image | valShow }}</td>
                        </tr>
                        <tr v-if="containers.environmentVariables && containers.environmentVariables.length > 0">
                            <th class="tai-table-cell-narrow tai-table-cell-right">环境变量</th>
                            <td>{{ containers.environmentVariables | arrShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">命令</th>
                            <td>{{ containers.commands | valShow }}</td>
                        </tr>
                        <tr>
                            <th class="tai-table-cell-narrow tai-table-cell-right">参数</th>
                            <td>{{ containers.args | valShow }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="events.length > 0" class="message-item">
                <div class="basic-title">Events</div>
                <table class="tai-table tai-table-border">
                    <thead class="tai-table-header">
                        <tr>
                            <th>Message</th>
                            <th width="15%">Source</th>
                            <th width="10%">Count</th>
                            <th width="">First seen</th>
                            <th width="">Last seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in events" :key="index">
                            <td>{{ item.message | valShow }}</td>
                            <td>{{ item.source | valShow }}</td>
                            <td>{{ item.count | valShow }}</td>
                            <td>{{ item.firstSeen | valShow }}</td>
                            <td>{{ item.lastSeen | valShow }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="persistentVolumeClaims.length > 0" class="message-item">
                <div class="basic-title">Events</div>
                <table class="tai-table tai-table-border">
                    <thead class="tai-table-header">
                        <tr>
                            <th>Name</th>
                            <th>状态</th>
                            <th>Capacity</th>
                            <th>AccessModes</th>
                            <th>Storage Class</th>
                            <th>创建时长</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in events" :key="index">
                            <td>{{ item.name | valShow }}</td>
                            <td>{{ item.status | valShow }}</td>
                            <td>{{ item.capacity | valShow }}</td>
                            <td>{{ item.accessModes | valShow }}</td>
                            <td>{{ item.storageClass | valShow }}</td>
                            <td>{{ item.age | valShow }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script src="./pod.js" />

<style scoped src="./detail.less" />
