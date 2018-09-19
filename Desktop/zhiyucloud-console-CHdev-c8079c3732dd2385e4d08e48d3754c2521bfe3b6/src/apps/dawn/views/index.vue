<template>
    <div class="content-wrap">
        <blank-iframe v-if="url" :url="url" />
    </div>
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
        this.url = '/console/old-dawn/list.html';
    }
}
</script>
<style scoped>
.content-wrap {
    padding: 10px 50px 80px;
}
</style>
