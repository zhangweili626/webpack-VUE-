<template>
    <div class="tabs-container">
        <div class="tab-box clearfix">
            <div class="tab-item pull-left" v-for="item in tabList" :key="item.value" @click="tabClick(item)">
                {{item.text}}
            </div>
        </div>
        <div class="tab-sub-box">
            <div class="tab-sub-item" v-for="item in itemList" :key="item.value" @click="subItemClick(item)">
                {{item.text}}
            </div>
            <p v-show="!itemList.length">暂无数据...</p>
        </div>
        
    </div>
</template>
<script>
export default {
    props: {
        tabList: {
            type: Array,
            required: true
        },
        itemList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {

        }
    },
    methods: {
        tabClick(item) {
            this.$emit('tabClick', item)
        },
        subItemClick(item) {
            this.$emit('subItemClick', item)
        }
    }
}
</script>
<style lang="scss" scoped>
.tabs-container {
    .tab-item {
        padding: 10px 8px;
    }
}
</style>




