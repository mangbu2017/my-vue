<template>
    <div class="container">
        <i-card :padding="33" class="card">
            <div class="spin-container">
                <i-spin>
                    <i-icon type="ios-loading" size="18" class="spin-icon-load" />
                    <div>注销中...</div>
                </i-spin>
            </div>
        </i-card>
    </div>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import request from '@/common/utils/request';


@Component()
export default class App extends Vue {
    created() {
        // 尝试登陆，如果结果如何，都删除本地CONSOLE_USER_IDENTITY
        request({
            method: 'POST',
            url: '/auth/user/loginout',
        }).then(() => {
            localStorage.removeItem('CONSOLE_USER_IDENTITY');
            this.$router.replace('/login');
        }).catch(() => {
            localStorage.removeItem('CONSOLE_USER_IDENTITY');
            this.$router.replace('/login');
        });
    }
}
</script>
<style scoped lang="less">
.container {
    width: 100%;
    min-width: 1200px;
    min-height: 100%;
    margin: auto;
    padding: 129px calc(50% - 600px + 8px);
    background:
        url(../assets/login-bg.png) no-repeat 50% 135px,
        linear-gradient(90deg, rgba(13, 7, 53, 1) 0%, rgba(31, 17, 100, 1) 100%);
}

.card {
    width: 446px;
    height: 483px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 1px 6px 2px rgba(204, 192, 192, 0.5);
    border-radius: 10px;
}

.spin-container {
    margin: 40px 0;
    padding: 0 10px;

    .spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
}
</style>
