<template>
    <div class="instance-overview">
        <div class="page-title">
            <h2>实例</h2>
        </div>
        <ul class="menu-wrap">
            <li
                v-for="(item, index) in instanceList"
                :key="index"
                :class="[ index === current ? 'menu-item-active' : '' ]"
            >
                <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        type: {
            type: String,
            default: '',
        },
    },
})

export default class SwitchTag extends Vue {
    instanceList = [
        {
            path: '/spray-alga',
            name: 'MySQL',
        },
        {
            path: '/spray-seahare',
            name: 'Redis',
        },
        {
            path: '/spray-trepang',
            name: 'MongoDB',
        },
        {
            path: '/spray-echinus',
            name: 'Memcache',
        },
        {
            path: '/spray-kafka',
            name: 'kafka',
        },
        {
            path: '/spray-rabbit',
            name: 'RabbitMQ',
        },
    ];

    current = 0;

    created() {
        this.current = this.instanceList.findIndex(n => n.name === this.type);
    }
}
</script>

<style scoped>
.instance-overview{
    position: relative;
    width: 100%;
    height: 30px;
}

.page-title {
    border-left: 3px solid #00b7ee;
    width: 80px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    margin:10px 0 30px;
}

.menu-wrap{
    position: absolute;
    height: 30px;
    line-height: 30px;
    top: 0;
    left:70px;
    list-style: none;
}

.menu-wrap li{
    background: #f1f1f1;
    margin-right: 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    float: left;
}

.menu-wrap li a{
    display: block;
    padding: 0 15px;
    color: #515a6e;
}

.menu-wrap li:hover,
.menu-wrap li.menu-item-active {
    background: #2D8cF0;
}

.menu-wrap li:hover a,
.menu-wrap li.menu-item-active a{
    color: #fff;
}
</style>
