import * as types from './mutation-types'

export default {
    [types.SKUCOMB_SHOW_SELECT_MODAL](state) {
        state.showSelectModal = true
    },
    [types.SKUCOMB_HIDE_SELECT_MODAL](state) {
        state.showSelectModal = false
    },
    [types.SKUCOMB_GET_SKUCOMB_LIST](state, { list }) {
        state.skuCombList = list
    },
    [types.SKUCOMB_SET_PAGER](state, { pager }) {
        state.pager = pager
    },
    [types.SKUCOMB_SET_ADD_SKUCOMB_SUCC](state) {
        state.addSkuCombSucc = true
    },
    [types.SKUCOMB_RESET_ADD_SKUCOMB_SUCC](state) {
        state.addSkuCombSucc = false
    },
    [types.SKUCOMB_SHOW_ADDITION](state) {
        state.showAddition = true
    },
    [types.SKUCOMB_HIDE_ADDITION](state) {
        state.showAddition = false
    },
    [types.SKUCOMB_SET_SKUCOMB_INFO](state, { skuCombInfo }) {
        state.skuCombInfo = skuCombInfo
    },
    [types.SKUCOMB_ADD_COMBITION_DETAIL_INFO](state, { skuCombDetailInfo }) {
        state.addSkuCombDetailList.push(skuCombDetailInfo)
    },
    [types.SKUCOMB_SET_ADD_COMBITION_DETAIL_LIST](state, { list }) {
        state.addSkuCombDetailList = list
    },
    [types.SKUCOMB_REMOVE_ADD_COMBITION_DETAIL_LIST](state, { index }) {
        state.addSkuCombDetailList.splice(index, 1)
    },
    [types.SKUCOMB_ADD_COMBITION_DETAIL_LIST](state, { list }) {
        state.skuCombDetailList = state.skuCombDetailList.concat(list)
    },
    [types.SKUCOMB_REMOVE_COMBITION_DETAIL_LIST](state, { index }) {
        state.skuCombDetailList.splice(index, 1)
    },
    [types.SKUCOMB_DELETE_COMBITION_DETAIL_LIST](state, { index }) {
        state.skuCombDetailList[index].isDeleted = '1' 
    },
    [types.SKUCOMB_SET_COMBITION_DETAIL_LIST](state, { list }) {
        state.skuCombDetailList = list
    },
    [types.SKUCOMB_COMMIT_COMBITION_DETAIL_LIST](state, { list }) {
        state.skuCombDetailList = state.skuCombDetailList.concat(list)
    },
    [types.SKUCOMB_GET_SKUINFO_LIST](state, { list }) {
        state.skuInfoList = list
    },
    [types.SKUCOMB_SET_SKUINFO_PAGER](state, { pager }) {
        state.skuPager = pager
    },
    [types.SKUCOMB_ADD_COMBITION_PRICE_LIST](state, { skuCombPriceInfo }) {
        state.skuCombPriceList.push(skuCombPriceInfo)
    },
    [types.SKUCOMB_REMOVE_COMBITION_PRICE_LIST](state, { index }) {
        state.skuCombPriceList.splice(index, 1)
    },
    [types.SKUCOMB_DELETE_COMBITION_PRICE_LIST](state, { index }) {
        state.skuCombPriceList[index].isDeleted = '1'
    },
    [types.SKUCOMB_SET_COMBITION_PRICE_LIST](state, { list }) {
        state.skuCombPriceList = list
    },
    [types.SKUCOMB_SET_COMBITION_USE_RANGE_LIST](state, { list }) {
        state.skuCombUseRangeList = list
    },
    
    [types.PRESERVE_SHOP](state, data) {
	    // state就是当前这个模块的下 state
	    state.tabType = data.tabType;
	    state.istabType = data.istabType
  	},
  	[types.SKUPRICE_GET_CHANNEL_TYPES](state, { options }) {
        state.channelTypes = options
    },
    [types.SERVICE_ADD_COMBITION_DETAIL_LIST](state,data) {
        state.addserviceCombDetailList.push(data)
    },
    
    [types.SKUCOMB_SET_SERVICE_PAGER](state,data){
    	state.servicePager = data
    },
    
    [types.SERVICE_SET_COMBITION_DETAIL_LIST](state,data){
    	state.serviceDList.push(data) 
    },
    
    [types.SET_SKU_SERVICE_INFO](state, data){
    	state.skuServiceInfo = data
    },
    
    
    
    //2018 zhang 新增
}