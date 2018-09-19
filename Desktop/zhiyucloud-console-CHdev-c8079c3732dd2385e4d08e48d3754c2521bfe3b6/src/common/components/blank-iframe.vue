<template>
    <iframe
        v-if="url"
        ref="iframe"
        :src="url"
        class="blank-iframe"
        marginwidth="0"
        marginheight="0"
        border="0"
        frameborder="no"
        scrolling="no"
        allowtransparency="yes"
    />
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import reAuthorize from '@/common/widgets/re-authorize';

// 适用于同域

@Component({
    props: {
        url: {
            type: String,
            required: true,
        },
    },
})
export default class BlankIframe extends Vue {
    handleChangeHeight = () => {
        const { iframe } = this.$refs;
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            iframe.height = iframe.contentDocument.body.scrollHeight;
        }
    };

    handleMutationObserver = () => {
        if (this.observer) {
            this.observer.disconnect();
        }
        const { iframe } = this.$refs;
        this.observer = new MutationObserver(this.handleChangeHeight);
        this.observer.observe(iframe.contentDocument.body, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    };

    bindChangeHeight() {
        const { iframe } = this.$refs;

        iframe.addEventListener('load', this.handleChangeHeight, false);
        iframe.addEventListener('load', this.handleMutationObserver, false);

        window.addEventListener('deviceorientation', this.handleChangeHeight, false);
        window.addEventListener('resize', this.handleChangeHeight, false);
    }

    unbindChangeHeight() {
        const { iframe } = this.$refs;

        iframe.removeEventListener('load', this.handleChangeHeight, false);
        iframe.removeEventListener('load', this.handleMutationObserver, false);

        window.removeEventListener('deviceorientation', this.handleChangeHeight, false);
        window.removeEventListener('resize', this.handleChangeHeight, false);
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    initBridge() {
        this.selfInitBridge = false;
        if (!window.showReAuthorize) {
            this.selfInitBridge = true;
            window.showReAuthorize = reAuthorize;
        }
    }

    destroyBridge() {
        if (this.selfInitBridge) {
            window.showReAuthorize = undefined;
        }
    }

    mounted() {
        this.bindChangeHeight();
        this.initBridge();
    }

    beforeDestroy() {
        this.unbindChangeHeight();
        this.destroyBridge();
    }
}

</script>
<style scoped lang="less">
    .blank-iframe {
        width: 100%;
    }
</style>
