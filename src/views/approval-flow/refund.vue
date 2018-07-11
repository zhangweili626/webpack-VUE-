<template>
	<div>
		<refund ref="refund" v-if="refshow"></refund>
	</div>
</template>

<script>
	import refund from '../refund/add-note'
	import api from 'common/api'
	export default{
		data(){
			return {
				refshow:true,
			}
		},
		components:{
			refund,
		},
		mounted(){
			this.get()
			
			
		},
		methods:{
			get(){ 
			  this.$nextTick(()=>{
			  		/* if(this.$route.name == 'approval-flow'){
						 	this.refshow = true
						 }else{
						 	this.refshow = false
						 }*/
			   		 this.$refs.refund.setOnlySee();
						api.refund.queryRefund({refundInvoiceOrderNo:this.$route.query.orderNo},(res)=>{
							if(res.data.code == 'success'){
								this.$nextTick(()=>{
									this.$refs.refund.setValue(res.data.obj);
								})
								
							}
						})
				   })
			
			},
		},
		watch:{
			'$route':'get'
		},
	}
</script>

<style>
</style>