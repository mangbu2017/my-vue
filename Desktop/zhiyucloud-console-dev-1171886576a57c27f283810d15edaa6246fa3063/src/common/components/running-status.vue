<template>
    <span v-if="animate" :class="[statusClass]">
        <span><i /></span>
        {{ statusTxt }}
    </span>
    <span v-else>{{ statusTxt }}</span>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        animate: {
            type: Boolean,
            default: true,
        },
        code: {
            type: Number,
            default: '--',
        },
    },

    watch: {
        code() {
            this.statusFormat(this.code);
        },
    },
})

export default class RunningStatus extends Vue {
    statusTxt = '';
    statusClass ='';

    statusFormat(code) {
        switch (code) {
            case 0:
                this.statusTxt = '创建中';
                this.statusClass = 'status-mediacy';
                break;
            case 1:
                this.statusTxt = '运行中';
                this.statusClass = 'status-running';
                break;
            case 3:
                this.statusTxt = '创建失败';
                this.statusClass = 'status-abnormal';
                break;
            case 5:
                this.statusTxt = '异常';
                this.statusClass = 'status-abnormal';
                break;
            case 6:
                this.statusTxt = '启动中';
                this.statusClass = 'status-mediacy';
                break;
            case 7:
                this.statusTxt = '重启中';
                this.statusClass = 'status-mediacy';
                break;
            case 8:
                this.statusTxt = '关机中';
                this.statusClass = 'status-mediacy';
                break;
            case 9:
                this.statusTxt = '关机';
                this.statusClass = 'status-closed';
                break;
            default:
                this.statusTxt = '--';
                this.statusClass = '';
        }
        return this;
    }

    created() {
        this.statusFormat(this.code);
    }
}
</script>

<style lang="less" scoped>
    @running: #008000;
    @mediacy: #FF8C00;
    @abnormal: #C62329;
    @closed: #828282;

    .dot {
        position: relative;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        margin-right: 3px;
    }
    .helo {
        position: absolute;
        top: 50%;
        left: 50%;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        margin:-4px 0 0 -4px;
    }

    .status-running {
        color: @running;
        span {
            .dot();
            background: @running;
        }
        i {
            .helo();
        }
    }

    .status-mediacy {
        color: @mediacy;
        span {
            .dot();
            background: @mediacy;
        }
        i {
            .helo();
            animation: ani-status-mediacy 1s linear infinite;
        }
    }

    .status-abnormal {
        color: @abnormal;
        span {
            .dot();
            background: @abnormal;
        }
        i {
            .helo();
        }
    }

    .status-closed {
        color: @closed;
        span {
            .dot();
            background: @closed;
        }
        i {
            .helo();
        }
    }

    @keyframes ani-status-mediacy {
        from {
            transform: scale(1);
            background: @mediacy;
            opacity: 0.6;
        }
        60% {
            transform: scale(1.5);
            background: @mediacy;
            opacity: 0.4;
        }
        to   {
            transform: scale(2.5);
            background: @mediacy;
            opacity: 0.2;
        }
    }
</style>
