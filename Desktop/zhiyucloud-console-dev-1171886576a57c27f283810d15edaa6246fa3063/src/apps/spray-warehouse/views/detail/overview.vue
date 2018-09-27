<template>
    <div>
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <div v-if="instance" class="message-item">
            <div class="basic-title">
                <span>基本信息</span>
                <i-button class="update-btn" type="primary" @click="handleActivateEdit">修改信息</i-button>
            </div>
            <table class="tai-table">
                <tbody>
                    <tr>
                        <td>镜像名称</td>
                        <td>{{ instance.wareHouseName }}</td>
                    </tr>
                    <tr>
                        <td>命名空间</td>
                        <td>{{ instance.nameSpace }}</td>
                    </tr>
                    <tr>
                        <td>镜像性质</td>
                        <td>{{ instance.houseTypeDesc }}</td>
                    </tr>
                    <tr>
                        <td>公网地址</td>
                        <td>{{ instance.publicUrl }}</td>
                    </tr>
                    <tr>
                        <td>内网地址</td>
                        <td>{{ instance.privateUrl }}</td>
                    </tr>
                    <tr>
                        <td>镜像地域</td>
                        <td>{{ instance.mirrorRegionDesc }}</td>
                    </tr>
                    <tr>
                        <td>摘要</td>
                        <td>{{ instance.digest }}</td>
                    </tr>
                    <tr>
                        <td>描述</td>
                        <td>{{ instance.descInfo ? instance.descInfo : '--' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="instance" class="message-item">
            <div class="basic-title">操作指南</div>
            <div class="operation">
                <div class="login">
                    <p>登录docker registry:</p>
                    <div class="command-message">{{ instance.loginCommand }}</div>
                    <p>登录registry的用户名和密码是您注册容器服务时注册的用户名和密码。</p>
                    <p>你可以在镜像管理首页点击修改密码按钮修改docker login密码。</p>
                </div>
                <div class="pull">
                    <p>从registry中拉取镜像：</p>
                    <div class="command-message">{{ instance.pullCommand }}</div>
                </div>
                <div class="push">
                    <p>将镜像推送到registry：</p>
                    <div class="command-message">
                        <div>{{ instance.pushCommand1 }}</div>
                        <div>{{ instance.pushCommand2 }}</div>
                        <div>{{ instance.pushCommand3 }}</div>
                    </div>
                    <p>其中[ImageId],[镜像版本号]请你根据自己的镜像信息进行填写。</p>
                </div>
            </div>
        </div>
        <update-modal
            v-if="isUpdating"
            :id="warehouseID"
            @on-ok="handleUpdateModalOk"
            @on-cancel="handleUpdateModalCancel"
        />
    </div>
</template>
<script src="./overview.js"/>
<style scoped src="./overview.less"/>
