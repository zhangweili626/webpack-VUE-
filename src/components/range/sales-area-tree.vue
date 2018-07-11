<template>
<div class="sale-tree-box">
    <el-tree 
        :data="saleTreeData" 
        :props="saleOptions" 
        :load="saleLoad" 
        node-key="id" lazy accordion check-strictly 
        :default-expanded-keys="[0]" 
        :expand-on-click-node="false" 
        @node-click="saleItemClick">
    </el-tree>
</div>
</template>
<script>

import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

import api from 'common/api'

export default {
    data() {
        return {
            saleTreeData: [],
            saleOptions: {
                label: 'name',
                children: 'zones'
            },
        }
    },
    computed: {
        availableType() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.availableType
                    : null
        } 
    },
    methods: {
        saleLoad(node, resolve) {
            // && this.availableType != 0
            if ( node.level === 0 ) {
                this.getSalesAreaFirstLevel(obj => {
                    let arr = [{
                        id: 0,
                        name: obj[0].areaName,
                        code: obj[0].areaCode
                    }];
                    return resolve(arr);
                })
            } else if( node.level !== 0 ) {
                let params = { areaCode: node.data.code }
                this.getSalesAreaInfoByAreaCode(params, items => {
                    let arr = [];
                    if (items !== null) {
                        items.forEach((item, index) => {
                            let data = {
                                name: item.areaName,
                                code: item.areaCode,
                            }
                            arr.push(data)
                        })
                    } else {
                        return resolve([])
                    }
                    return resolve(arr)
                })
            }
        },
        // 根据账号权限获取销售区域一级目录
        getSalesAreaFirstLevel(next) {
            api.getSalesAreaInfoByUserAvailableAllLevel(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    next(obj)
                }
            })
        },
        getSalesAreaInfoByAreaCode(params, next) {
            api.area.getSalesAreaInfoByAreaCode(params, res => {
                if (res.data.code === 'success') {
                    let items = res.data.obj.salesAreaSubInfo;
                    next(items)
                }
            })
        },
        saleItemClick(data) {
            this.$emit('itemClick', data);
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



