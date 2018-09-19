<template>
    <div>
        <i-menu
            v-show="!isCollapsed"
            :active-name="current"
            v-model="isCollapsed"
            :class="menuitemClasses"
            :open-names="openNames"
            accordion
            theme="dark"
            width="auto"
            @on-select="pageTurn"
        >
            <i-menu-item name="1">
                <i class="menu-ico ico-preview" />
                概览
            </i-menu-item>
            <i-menu-item name="2">
                <i class="menu-ico ico-ecs" />
                ECS
            </i-menu-item>
            <i-submenu name="3">
                <template slot="title">
                    <i class="menu-ico ico-docker" />
                    容器
                </template>
                <i-submenu name="3-1">
                    <template slot="title">
                        容器镜像
                    </template>
                    <i-menu-item name="3-1-1">镜像仓库</i-menu-item>
                    <i-menu-item name="3-1-2">命名空间</i-menu-item>
                </i-submenu>
                <i-submenu name="3-2">
                    <template slot="title">
                        容器服务
                    </template>
                    <i-menu-item name="3-2-1">服务</i-menu-item>
                    <i-menu-item name="3-2-2">实例</i-menu-item>
                </i-submenu>
            </i-submenu>
            <i-submenu name="4">
                <template slot="title">
                    <i class="menu-ico ico-database" />
                    数据库
                </template>
                <i-menu-item name="4-1">MySql</i-menu-item>
                <i-menu-item name="4-2">Redis</i-menu-item>
                <i-menu-item name="4-3">MongoDB</i-menu-item>
            </i-submenu>
            <i-submenu name="5">
                <template slot="title">
                    <i class="menu-ico ico-storage" />
                    存储
                </template>
                <!--<i-menu-item name="5-1" to="/">云硬盘</i-menu-item>-->
                <i-menu-item name="5-2">对象存储</i-menu-item>
            </i-submenu>
            <i-menu-item name="6">
                <i class="menu-ico ico-log" />
                日志服务
            </i-menu-item>
        </i-menu>

        <!--折叠状态导航-->
        <div v-show="isCollapsed" theme="dark" width="auto" class="menu-collapsed">
            <div class="menu-wrap">
                <i-tooltip content="概览" placement="right">
                    <i-menu-item name="1" to="/">
                        <i class="menu-ico ico-preview" />
                    </i-menu-item>
                </i-tooltip>
            </div>

            <div class="menu-wrap">
                <i-tooltip content="ECS" placement="right">
                    <i-menu-item name="2" to="/ecs-seabed">
                        <i class="menu-ico ico-ecs" />
                    </i-menu-item>
                </i-tooltip>
            </div>

            <div class="menu-wrap">
                <i-dropdown placement="right">
                    <i class="menu-ico ico-docker" />
                    <i-dropdown-menu slot="list">
                        <i-dropdown placement="right-start">
                            <i-dropdown-item>
                                容器镜像
                                <i-icon type="ios-arrow-forward" />
                            </i-dropdown-item>
                            <i-dropdown-menu slot="list">
                                <i-dropdown-item><router-link to="/spray-warehouse">镜像仓库</router-link></i-dropdown-item>
                                <i-dropdown-item><router-link to="/spray-namespace">命名空间</router-link></i-dropdown-item>
                            </i-dropdown-menu>
                        </i-dropdown>
                    </i-dropdown-menu>
                    <i-dropdown-menu slot="list">
                        <i-dropdown placement="right-start">
                            <i-dropdown-item>
                                容器服务
                                <i-icon type="ios-arrow-forward" />
                            </i-dropdown-item>
                            <i-dropdown-menu slot="list">
                                <i-dropdown-item><router-link to="/spray-service-list">服务</router-link></i-dropdown-item>
                                <i-dropdown-item><router-link to="/spray-alga">实例</router-link></i-dropdown-item>
                            </i-dropdown-menu>
                        </i-dropdown>
                    </i-dropdown-menu>
                </i-dropdown>
            </div>

            <div class="menu-wrap">
                <i-dropdown placement="right">
                    <i class="menu-ico ico-database" />
                    <i-dropdown-menu slot="list">
                        <i-dropdown-item><router-link to="/ecs-alga/">MySql</router-link></i-dropdown-item>
                        <i-dropdown-item><router-link to="/ecs-seahare/">Redis</router-link></i-dropdown-item>
                        <i-dropdown-item><router-link to="/ecs-trepang/">MongoDB</router-link></i-dropdown-item>
                    </i-dropdown-menu>
                </i-dropdown>
            </div>

            <div class="menu-wrap">
                <i-dropdown placement="right">
                    <i class="menu-ico ico-storage" />
                    <i-dropdown-menu slot="list">
                        <!--<i-dropdown-item><router-link to="/">云硬盘</router-link></i-dropdown-item>-->
                        <i-dropdown-item><router-link to="/dawn">对象存储</router-link></i-dropdown-item>
                    </i-dropdown-menu>
                </i-dropdown>
            </div>

            <div class="menu-wrap">
                <i-tooltip content="日志服务" placement="right">
                    <i-menu-item name="7" to="/coral">
                        <i class="menu-ico ico-log" />
                    </i-menu-item>
                </i-tooltip>
            </div>

        </div>
    </div>
</template>

<script src="./side-menu.js"></script>

<style scoped src="./side-menu.less"></style>
