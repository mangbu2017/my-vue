<template>
    <blank-iframe v-if="url" :url="url" />
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import BlankIframe from '@/common/components/blank-iframe.vue';

@Component({
    components: {
        BlankIframe,
    },
})
export default class sprayServiceList extends Vue {
    url = '';

    created() {
        this.url = `/console/monitor/spray-mongodb/monitor.html?id=${this.$route.params.id}`;
    }
}
</script>
