<template>
    <div>
        <div class="switch-tags">
            <common-tags :type="`MongoDB`" />
        </div>
        <router-view />
    </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import CommonTags from '@/common/components/switch-instance.vue';

@Component({
    components: {
        CommonTags,
    },
})
export default class App extends Vue {}
</script>
<style scoped>
    .switch-tags {
        padding: 10px 50px 0;
    }
</style>
