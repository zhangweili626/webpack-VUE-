<template>
	<div>
		<reimburse ref="reimburse" v-if="refundType == 1"></reimburse>
		<backCar v-if="refundType == 0" ref="backCar"></backCar>
	</div>
</template>

<script>
	import reimburse from'./reimburse'
	import backCar from './back-car'
	import api from 'common/api.js'
	export default{
		components:{
			reimburse,
			backCar
		},
		data(){
			return{
				refundType:null,
			}
		},
		mounted(){
			this.getData();
		},
		methods:{
			  getData(){
			  	  api.returnCard.getCardRefundOrderInfoByCardCode({cardRefundOrderNo:this.$route.query.orderNo}, res => {
                    if(res.data.code === 'success') {
                    	if(res.data.obj.refundType == 1){
                    		this.refundType = 1
                    	     this.$nextTick(() => {
                    	     	this.$refs.reimburse.getValueCardInfo()
                    	     })
                    	}else{
                    		this.refundType = 0
                    		 this.$nextTick(() => {
                    	     	this.$refs.backCar._initData()
                    	     })
                    		
                    	}
                
                    }
                })
			  },
			   
		},
		watch:{
			'$route':'getData'
		}
		
	}
</script>

<style>
</style>