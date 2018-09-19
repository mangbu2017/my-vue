<template>
    <div class="layout">
        <div class="banner">
            <a href="/" class="site-logo">
                <img src="../assets/logo-text.png" class="logo" alt="智渔云">
            </a>
        </div>
        <div class="content">
            <slot name="content" />
        </div>
    </div>
</template>

<style scoped lang="less">
.layout {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    min-width: 1200px;
    .banner {
        height: 60px;
        padding: 0 calc(50% - 600px + 8px);
        background-color: rgba(13, 7, 53, 1);

        .logo {
            width: 128px;
            height: 30px;
            margin-top: 15px;
        }
    }

    .content {
        position: absolute;
        top: 60px;
        right: 0;
        bottom: 0;
        left: 0;
    }
}
</style>
