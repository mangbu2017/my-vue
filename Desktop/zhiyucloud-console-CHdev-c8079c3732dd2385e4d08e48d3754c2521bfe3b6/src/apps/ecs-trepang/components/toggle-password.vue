<template>
    <div>
        <span v-if="isShown">{{ password }}</span>
        <span v-else>********</span>
        <i-icon :type="iconType" class="icon-eye" @click="handleToggle" />
    </div>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        password: {
            type: String,
        },
    },
})
export default class TogglePassword extends Vue {
    isShown = false;
    iconType = 'md-eye-off';

    handleToggle() {
        this.isShown = !this.isShown;
        this.iconType = this.isShown ? 'md-eye' : 'md-eye-off';
    }
}
</script>
<style>
.icon-eye{
    margin-left: 10px;
    cursor: pointer;
}
</style>
