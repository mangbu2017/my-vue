<template>
    <i-form-item label="存储空间" prop="disk">
        <div class="tai-form-slider">
            <div class="tai-slider-content">
                <i-slider
                    :value="innerValue"
                    :min="minSize"
                    :max="maxSize"
                    :step="step"
                    name="disk"
                    show-tip="hover"
                    class="tai-slider"
                    @on-input="handleChangeDisk"
                />
                <i-input-number
                    :value="innerValue"
                    :min="minSize"
                    :max="maxSize"
                    :step="step"
                    @on-change="handleChangeDisk"
                    @on-blur="handleBlurInput"
                />GB
            </div>
            <div class="tai-slider-tip">
                <span class="min-size">{{ minSize }}GB</span>
                <span class="max-size">{{ maxSize }}GB</span>
                <span class="ram-tip">存储空间{{ minSize }}GB～{{ maxSize }}GB</span>
            </div>
        </div>
    </i-form-item>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        value: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            default: 500,
        },
        min: {
            type: Number,
            default: 10,
        },
        step: {
            type: Number,
            default: 5,
        },
    },
    watch: {
        value() {
            this.innerValue = this.value;
        },
        min() {
            if (this.max < this.min) {
                throw new Error('min不能大于max');
            }
            if (this.min > this.innerValue) {
                this.innerValue = this.min;
            }
        },
        max() {
            if (this.max < this.min) {
                throw new Error('min不能大于max');
            }
            if (this.max < this.innerValue) {
                this.innerValue = this.max;
            }
        },
    },
})

export default class TaiSlider extends Vue {
    constructor(...args) {
        super(...args);

        if (this.max < this.min) {
            throw new Error('min不能大于max');
        }

        this.maxSize = this.max;
        this.minSize = this.min;
        this.innerValue = this.value;

        if (this.min > this.innerValue) {
            this.innerValue = this.min;
        }
        if (this.max < this.innerValue) {
            this.innerValue = this.max;
        }
    }

    handleChangeDisk(value) {
        this.innerValue = value;
        this.$emit('input', this.innerValue);
    }

    handleBlurInput() {
        let fixedValue = this.innerValue;

        if (fixedValue % 10 !== 5) {
            fixedValue = Math.round(fixedValue / 10) * 10;
        }
        this.innerValue = fixedValue;
        this.$emit('input', this.innerValue);
    }
}
</script>

<style scoped>
.tai-form-slider{
    position: relative;
    width: 300px;
    margin-bottom: 20px;
}

.tai-slider-content .tai-slider{
    width: 190px;
    margin-right: 10px;
    float: left;
}

.tai-slider-tip .ram-tip {
    position: absolute;
    top: 50px;
    left: 0;
    color: #999;
    line-height: 1.5;
}

.tai-slider-tip .min-size {
    position: absolute;
    top: 20px;
    left: -5px;
}

.tai-slider-tip .max-size{
    position: absolute;
    top: 20px;
    left: 146px;
}
</style>
