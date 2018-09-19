<template>
    <div class="layout">
        <i-layout>
            <i-sider
                ref="side1"
                :collapsed-width="68"
                v-model="isCollapsed"
                width="215"
                hide-trigger
                collapsible
            >
                <a :class="collapsedClasses" href="/" class="site-logo">
                    <img src="../assets/logo-text.png" alt="智渔云">
                </a>
                <side-menu :show="isCollapsed" />
            </i-sider>
            <i-layout>
                <i-header class="layout-header-bar">
                    <i-icon
                        :class="rotateIcon"
                        type="md-menu"
                        size="24"
                        @click.native="collapsedSider"
                    />
                    <i-dropdown class="user-profile" @on-click="handleDropdownClick">
                        {{ username }}
                        <i-dropdown-menu slot="list">
                            <i-dropdown-item name="logout">退出</i-dropdown-item>
                        </i-dropdown-menu>
                    </i-dropdown>
                </i-header>
                <i-content>
                    <slot name="content" />
                </i-content>
                <i-footer class="footer-copyright">2018 &copy; zhiyucloud</i-footer>
            </i-layout>
        </i-layout>
    </div>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import SideMenu from '../components/side-menu.vue';

@Component({
    name: 'frame-layout',
    components: {
        SideMenu,
    },
})

export default class Layout extends Vue {
    username = '';

    constructor() {
        super();

        const identity = JSON.parse(localStorage.getItem('CONSOLE_USER_IDENTITY'));
        if (identity && identity.username) {
            this.username = identity.username;
        }
    }

    isCollapsed = false

    get collapsedClasses() {
        return [
            this.isCollapsed ? 'collapsed-logo' : '',
        ];
    }

    get rotateIcon() {
        return [
            'menu-icon',
            this.isCollapsed ? 'rotate-icon' : '',
        ];
    }

    collapsedSider() {
        this.$refs.side1.toggleCollapse();
    }

    handleDropdownClick(name) {
        if (name === 'logout') {
            this.$router.push('/logout');
        }
    }
}
</script>
<style scoped>
    .ivu-layout {
        height: 100vh;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .menu-icon {
        margin: 0 10px;
        cursor: pointer;
        transition: all .3s;
    }
    .rotate-icon {
        transform: rotate(-90deg);
    }
    .site-logo {
        display: block;
        padding:10px;
        text-align: center;
    }
    .site-logo img {
        width: 128px;
    }
    .collapsed-logo {
        width: 58px;
        padding-left: 20px;
        overflow: hidden;
        transition: all .4s;
    }
    .user-profile {
        cursor: pointer;
        height:60px;
        line-height: 60px;
        margin:0 50px 0 0;
        float: right;
    }
    .footer-copyright {
        height:50px;
        text-align: center;
    }

    .layout-header-bar {
        padding: 0px;
        border-bottom:1px solid #e5e4e4;
    }
    .ivu-layout-content {
        background: #fff;
    }
</style>
