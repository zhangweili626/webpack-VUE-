<template>
    <div class="animated fadeIn">
         <b-modal id="modal2" size="sm" title="添加扩展信息" ref="modal2" @show="modal2Show">
			 <div class="container-fluid">
				 <b-row class="car-add-search">
					 <el-input
						placeholder="筛选附加信息"
						icon="close"
						v-model="modelName"
						:on-icon-click="clearText">
					</el-input>
				 </b-row>				 
				<div class="car-add-box">
					<b-form-checkbox-group  id="checkbox" name="checkbox" v-model="selModelAdd">
						<b-form-checkbox class="checkbox-box ml-1"  v-for="(item,index) in modelAddList" :key="index"  :value="item">{{item.carAddName}}</b-form-checkbox>       
					</b-form-checkbox-group>					
				</div>				
			 </div>
			<div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right" variant="success" @click="addModelAdd">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal2">取消</b-btn>
			</div>
		</b-modal>
    </div>
</template>
<script>
import Vue from "vue"
import suitScope from 'components/iris-suitscope'
import { Message, Input } from "element-ui"
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'

Vue.use(Input)

//  已添加扩展信息条目 addedModelList
// 选择确定触发事件selectCarAdd
export default {
    components: {
    },
    props: {
        addedModelList: {
                type: Array,
                default: function() {
                    return [];
                }
            },
    },
    data() {
        return {       
            // 未添加扩展信息条目
            modelAddList: [],
            modelName: '',
            selModelAdd: [],
        }
    },
    computed: {
       
    },
    created() {
        
    },
    methods: {
        // 获取车型扩展信息
        getModelAdd(val) {			
            let refName = val?val:'';
            const option = {
                'refCode': config.skuCar.modelAdd,
                'refDetailName': refName.trim(),
                'pageNums': 1000,
                'pageStart': 1
            }
            api.ref.getDataDictionarysPages(option, (res) => {
                if(res.data.code === 'success') {
                    let arr = res.data.obj.list;						
                    let data = [];
                    for(let [i,item] of arr.entries()) {
                        if(item.isDeleted != 1) {
                            let obj = {};
                            obj.carAddName = item.refDetailName;
                            obj.carAddCode = item.refDetailCode;
                            data.push(obj);
                        }							
                    }	                   			
                    if(this.addedModelList.length != 0 ) {
                        for(let i = 0; i < this.addedModelList.length; i++) {                         
                            for(let j = 0; j < data.length; j++) {
                                if(this.addedModelList[i].carAddCode === data[j].carAddCode) {
                                    data.splice(j, 1);
                                    break;
                                }
                                
                            }
                        }
                    }
                    this.modelAddList = [...data];					
                };
            })
        },
        clearText(){
            this.modelName = '';
        },
        showModel() {          
            this.$refs.modal2.show();
        },
        modal2Show() {
            this.selModelAdd = [];
            this.getModelAdd();
        },
        addModelAdd() {
            this.$emit('selectCarAdd', this.selModelAdd);
            this.$refs.modal2.hide();
        },
        cancelModal2() {
            this.$refs.modal2.hide();
        },
    },
    watch:{
        modelName(val){
            this.getModelAdd(val);
        },
    }
}
</script>

<style scoped>
.car-add-search{
	padding: 5px 14px;
}
.car-add-box{
	width: 100%;
	height: 300px;
	overflow: auto;
}
.checkbox-box{
	display: block;
}
.add-box{
    width: 250px;
}
</style>
