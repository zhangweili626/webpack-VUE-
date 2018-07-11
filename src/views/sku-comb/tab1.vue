<template>
	<div>
		<div class="row">
	  		<div class="col-md-12">
	  			<b-button size="sm" variant="success" v-b-modal.insert @click="insertClick">新增</b-button>
				<b-button size="sm" variant="danger" @click="editContract('delete')">删除</b-button>
				<b-button size="sm" variant="primary" @click="editContract('update')">编辑</b-button>
	  		</div>
	  	</div>
	     <div class="table-scrollable mb-2">
	        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="skuServiceInfo" :fields="fields">
	            <template slot="radio" slot-scope="data">
	                <input type="radio" name="radio" :value="data.index" v-model="selectcheck"/>
	            </template> 
	            <template slot="detailType" slot-scope="row">
	                	{{row.value == 0 ? 'sku商品' : '服务'}}
	            </template>
	        
	        </b-table>
	    </div>
	    <select-modal ref="selectModal" :combinationCode="combinationCode"></select-modal>

		<b-modal title="编辑产品"
				id="update"
				ref="modal"
				no-close-on-backdrop 
				no-close-on-esc 
				size="lg" 
				button-size="sm"
				@ok="comfirmUpdate"
				ok-title="确定" 
				cancel-title="取消">
			<div class="row">
				<div class="col-md-6">
					<b-form-fieldset horizontal label="类型" label-text-align="right" :label-cols="4">
						<b-form-input :value="item.detailType == 0 ? 'sku商品' : '服务'" readonly></b-form-input>
					</b-form-fieldset>    
				</div>
				<div class="col-md-6">
					<b-form-fieldset horizontal label="产品编码" label-text-align="right" :label-cols="4">
						<b-form-input v-model.trim="item.detailCode" readonly></b-form-input>
					</b-form-fieldset>    
				</div>
			</div>
			<div class="row">
				<div class="col-md-6">
					<b-form-fieldset horizontal label="	产品名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model.trim="item.detailName" readonly></b-form-input>
					</b-form-fieldset>    
				</div>
				<div class="col-md-6">
					<b-form-fieldset horizontal label="	数量" label-text-align="right" :label-cols="4">
						<b-form-input v-model.trim="item.detailNums" type="number"></b-form-input>
					</b-form-fieldset>    
				</div>
			</div>
	
	</b-modal>
	</div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import selectModal from './selectModal'
import { Message, MessageBox } from 'element-ui'
import api from 'common/api'

export default{
	components: {
		selectModal
	},
    props:['combinationCode'],
    data() {
        return {
            fields: {
                radio: {
                    label: '选择'
                },
                detailType: {
                    label: '类型'
                },
                detailCode: {
                    label: '产品编码'
                },
                detailName: {
                    label: '产品名称'
                },
				detailNums: {
                    label: '数量'
                },
            },
			selectcheck: -1,
			item: {}
        }
	},
	computed: {
		...mapGetters('skuComb', [
		   'skuServiceInfo'
    	])
	},
	mounted() {
		let params = this.$route.params
		if(params.hasOwnProperty('combinationCode')) {
			this.getSkuServiceInfo(params)
		}
	},
    methods: {
    	...mapActions('skuComb', [
		   'getSkuServiceInfo'
		]),
		insertClick() {
			this.$refs.selectModal.reset()
		},
    	editContract(isDelete) {
		    if(this.selectcheck === -1) {
                Message({
                    type: 'warning',
                    message: "请选择一条数据"
                })
                return
			}else if(isDelete === 'delete') {
				const createElement = this.$createElement;
                MessageBox({
                    title: '提示',
                    message: createElement('p', null, [
                            createElement('span', null, '是否确定删除'),
                        ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            let list = JSON.parse(JSON.stringify(this.skuServiceInfo))
							list[this.selectcheck].isDeleted = 1
							let params = [list[this.selectcheck]]
							this.edit(params)
                            done()
                        } else {
                            done();
                            return
                        }
                    }
                }).then( action => {}).catch(() => {})	
			}else {
				this.$refs.modal.show()
				let list = JSON.parse(JSON.stringify(this.skuServiceInfo))
				this.item = list[this.selectcheck]
			}	
		},
		comfirmUpdate() {
			let params = {
				id: this.item.id,
				combinationCode: this.item.combinationCode,
                combinationDetailCode: this.item.combinationDetailCode,
                detailCode: this.item.detailCode,
                detailName: this.item.detailName,
                detailType: this.item.detailType,
                detailNums: this.item.detailNums,
                isDeleted: 0
			}
			this.edit([params])
		},
		edit(params) {
			api.skuComb.addOrUpdateCombinationDetailInfoBatch(params, res => {
				if (res.data.code === "success") {
					this.selectcheck = -1;
					Message({
						type: "success",
						message: "操作成功!"
					})

					let params = this.$route.params
					params.hasOwnProperty('combinationCode')
					       ? this.getSkuServiceInfo(params) 
					       : this.getSkuServiceInfo({"combinationCode": this.combinationCode})
				}
			})
		}
    },
   
	}
</script>

<style>
</style>