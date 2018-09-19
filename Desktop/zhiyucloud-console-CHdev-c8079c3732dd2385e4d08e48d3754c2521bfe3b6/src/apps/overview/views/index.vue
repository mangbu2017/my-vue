<template>
    <div class="content-wrap">
        <div v-if="loading">
            <i-spin>
                <i-icon type="ios-loading" size="18" class="loading-spin-icon-load" />
                <div>加载中...</div>
            </i-spin>
        </div>

        <i-card v-if="list" :padding="0" class="source-content">
            <p slot="title">资源使用概览</p>
            <div class="overview-user">
                <h4>实例
                    <i-tooltip placement="bottom" class="overview-icon">
                        <img src="../assets/icon.png" alt="">
                        <div slot="content">
                            <p>实例计算涵盖如下子产品</p>
                            <p>•MongoDB</p>
                            <p>•Redis</p>
                            <p>•MySQL</p>
                            <p>•ECS</p>
                        </div>
                    </i-tooltip>
                </h4>
                <div class="overview-content">
                    <img src="../assets/instance.png" alt="">
                    <b style="color: #3399ff;">{{ list.instanceNum }}</b>个
                </div>
            </div>
            <div class="overview-user">
                <h4>公网IP
                    <i-tooltip placement="bottom" class="overview-icon">
                        <img src="../assets/icon.png" alt="">
                        <div slot="content">
                            <p>公网IP计算涵盖如下子产品</p>
                            <p>•MongoDB</p>
                            <p>•Redis</p>
                            <p>•MySQL</p>
                            <p>•ECS</p>
                        </div>
                    </i-tooltip>
                </h4>
                <div class="overview-content">
                    <img src="../assets/public.png" alt="">
                    <b style="color: #00cc66;">{{ list.publicIpNum }}</b>个
                </div>
            </div>
            <div class="overview-user">
                <h4>CPU
                    <i-tooltip placement="bottom" class="overview-icon">
                        <img src="../assets/icon.png" alt="">
                        <div slot="content">
                            <p>CPU计算涵盖如下子产品</p>
                            <p>•MongoDB</p>
                            <p>•Redis</p>
                            <p>•MySQL</p>
                            <p>•ECS</p>
                        </div>
                    </i-tooltip>
                </h4>
                <div class="overview-content">
                    <img src="../assets/cpu.png" alt="">
                    <b style="color: #ff9900;">{{ list.cpunum }}</b>核
                </div>
            </div>
            <div class="overview-user">
                <h4>内存
                    <i-tooltip placement="bottom" class="overview-icon">
                        <img src="../assets/icon.png" alt="">
                        <div slot="content">
                            <p>内存计算涵盖如下子产品</p>
                            <p>•MongoDB</p>
                            <p>•Redis</p>
                            <p>•MySQL</p>
                            <p>•ECS</p>
                        </div>
                    </i-tooltip>
                </h4>
                <div class="overview-content">
                    <img src="../assets/mem.png" alt="">
                    <b style="color: #ff6600;">{{ list.mem }}</b>GB
                </div>
            </div>
            <div class="overview-user">
                <h4>硬盘
                    <i-tooltip placement="bottom" class="overview-icon">
                        <img src="../assets/icon.png" alt="">
                        <div slot="content">
                            <p>硬盘计算涵盖如下子产品</p>
                            <p>•MongoDB</p>
                            <p>•Redis</p>
                            <p>•MySQL</p>
                            <p>•ECS</p>
                        </div>
                    </i-tooltip>
                </h4>
                <div class="overview-content">
                    <img src="../assets/cloud.png" alt="">
                    <b style="color: #ff3303;">{{ list.disk }}</b>GB
                </div>
            </div>
        </i-card>

        <i-card v-if="list" class="source-content">
            <p slot="title">资源配额使用详情</p>
            <i-row :gutter="16" class="source-detail">
                <i-col span="6" push="1">
                    <h4>详情</h4>
                    <p><span>实例（个）</span>{{ list.instanceNum }}</p>
                    <p><span>CPU（核）</span>{{ list.cpunum }}</p>
                    <p><span>内存（GB）</span>{{ list.mem }}</p>
                </i-col>
                <i-col span="6" push="1">
                    <h4>数据库</h4>
                    <p><span>MongoDB（个）</span>{{ list.insMongoNum }}</p>
                    <p><span>Redis（个）</span>{{ list.insRedisNum }}</p>
                    <p><span>MySQL（个）</span>{{ list.insMysqlNum }}</p>
                </i-col>
                <i-col span="6" push="1">
                    <h4>网络与CDN</h4>
                    <p><span>公网IP（个）</span>{{ list.publicIpNum }}</p>
                </i-col>
                <i-col span="6" push="1">
                    <h4>存储</h4>
                    <p><span>硬盘（GB）</span>{{ list.disk }}</p>
                    <p><span>对象存储（个）</span>{{ list.bucketSize }}</p>
                </i-col>
            </i-row>
        </i-card>
    </div>

</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';

@Component()

export default class overview extends Vue {
    list = null;

    loading = true;

    created() {
        this.getResource();
    }

    getResource() {
        this.loading = true;
        request({
            url: '/quotaBack/getResource',
        }).then((data) => {
            this.loading = false;
            if (data.resultBean) {
                this.list = data.resultBean;
            }
        }).catch((error) => {
            this.loading = false;
            this.$Message.error({
                content: error.message,
            });
        });
    }
}

</script>
<style scoped>
    .content-wrap {
        padding: 30px 50px 80px;
    }
    .source-content {
        height: 220px;
        margin-bottom: 20px;
    }
    .overview-user{
        width: 20%;
        height: 168px;
        padding: 20px;
        float: left;
        border-right: 1px solid #e8e8e8;
    }
    .overview-user h4{
        width: 100%;
        color: #464c5b;
    }
    .overview-icon{
        float: right;
    }
    .overview-icon img{
        width: 18px;
        height: auto;
    }
    .overview-content{
        width: 100%;
        text-align: center;
        margin-top: 25px;
    }
    .overview-content b{
        font-weight: normal;
        font-size: 36px;
        margin: 0 3px;
    }
    .overview-content img{
        width: 30px;
        height: auto;
    }
    .source-detail h4 {
        color: #17233d;
        font-size: 14px;
        margin-bottom: 15px;
    }
    .source-detail p {
        height: 24px;
        color: #657180;
        line-height: 24px;
    }
    .source-detail p span {
        display: inline-block;
        width: 120px;
    }
</style>
