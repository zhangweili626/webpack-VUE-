<template>
<div class="sale-tree-box">
    <el-tree 
        :data="chinaTreeData" 
        :props="chinaOptions" 
        :load="chinaLoad" node-key="id" 
        lazy accordion check-strictly 
        :default-expanded-keys="[0]" 
        :expand-on-click-node="false" 
        @node-click="chinaItemClick">
    </el-tree>
</div>
</template>
<script>

import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

import api from 'common/api'
import config from 'common/config'

export default {
    data() {
        return {
            chinaTreeData: [],
            chinaOptions: {
                children: 'children',
                label: 'name'
            },
        }
    },
    methods: {
        chinaLoad(node, resolve) {
            if (node.level === 0) {
                let params = { areaCode: config.areaRoot.area }
                api.area.getChinaAreaInfoByAreaCode(params).then(res => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj
                        let arr = [{
                            id: 0,
                            name: obj.areaName,
                            code: obj.areaCode
                        }];
                        return resolve(arr)
                    }
                })
            } else {
                let params = { areaCode: node.data.code };
                api.area.getChinaAreaInfoByAreaCode(params).then(res => {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.chinaAreaSubInfo;
                        let arr = [];
                        if (items !== null) {
                            items.forEach((item, index) => {
                                let data = {
                                    name: item.areaName,
                                    code: item.areaCode
                                }
                                arr.push(data)
                            })
                        } else {
                            return resolve([])
                        }
                        return resolve(arr)
                    }
                })
            }
        },
        chinaItemClick(data) {
            this.$emit('itemClick', data)
        },
    }
}
</script>
<style scoped>
.sale-tree-box {
    height: 200px;
    overflow-y: scroll;
}
</style>



