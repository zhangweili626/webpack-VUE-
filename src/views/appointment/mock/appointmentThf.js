/**
 * ---预约单所有查询列表接口---
 * 
 * .预约单新增或者更新预约单信息接口
 * /v2/aftersales/book/insertOrUpdateBookOrderInfo.htm
 * 》》》》
 * . ………………预约单信息更新
 * /v2/aftersales/book/updateBookOrderInfo
 * 
 * 《《《《
 * .推荐服务button接口
 * /v2/aftersales/storeservice/getCategoryInfoByStoreCode.htm
 * 
 * .根据门店和类别查询服务信息（和接口2相关联）
 * /v2/aftersales/storeservice/getServiceInfoByStoreCodeAndCategoryCode.htm
 * 
 * .点击3中的服务信息会调用添加相关联的服务信息（添加服务信息）
 * /v2/aftersales/book/getBookOrderServiceDetailInfoByCode.htm
 * 
 * .作废服务信息
 * /v2/aftersales/book/cancelBookOrderService
 * 
 * .预约单服务明细信息编辑
 * /v2/aftersales/book/editBookOrderServiceDetailInfo
 * 
 * .门店日期限制（T + N）中的 N 取值
 * /v1/sys/store/queryAllInfo
 * 
*/
// 引入mockjs
import Mock from 'mockjs'
// 预约单修改返回接口数据 start  // 算个小查询
let insertOrUpdateBookOrderInfo = Mock.mock('https://thf.insertOrUpdateBookOrderInfo.htm',{
	"code": "success",
	"message": "success",
	"obj": {
		"id": null,
		"isDeleted": "0",
		"createBy": null,
		"createTime": null,
		"updateBy": null,
		"updateTime": 1530943206410,
		"createOrgCode": null,
		"pageStart": 1,
		"pageNums": 2,
		"empToken": null,
		"bookOrderInfoVo": {
			"id": "1fd9c41da4fd462fb4e865fa07dad14a",
			"isDeleted": "0",
			"createBy": null,
			"createTime": null,
			"updateBy": null,
			"updateTime": 1530943206410,
			"createOrgCode": null,
			"pageStart": 1,
			"pageNums": 2,
			"empToken": "4e3c0076cc7a4ed19e7bb899917f0ea3",
			"remark": null,
			"bookOrderNo": "BOI2018070602014311",
			"orderNo": null,
			"storeCode": "STORE2000985",
			"storeName": "乐山大佛店",
			"businessTypeCode": "CarWash",
			"businessTypeName": "洗车",
			"channelTypeCode": "ShopReservation",
			"channelTypeName": null,
			"bookingEnteringTime": null,
			"bookingConfirmTime": null,
			"bookOrderPrice": null,
			"salesEmpCode": "EMP2000704",
			"salesEmpName": "乐山大佛店",
			"custCode": "CUSTOM2006820",
			"custName": "zhaosi",
			"custPhone": null,
			"custMobile": "13222223276",
			"vehicleCode": "CV20180707001199",
			"custPlates": "linshipaizhao",
			"vinCode": null,
			"carCode": "CAR2000533",
			"carName": null,
			"carDisplayName": "周厂家周品牌1周车系1周车型1周进气1周排量1",
			"carFactoryCode": "CARF2000101",
			"carFactoryName": "周厂家",
			"carBrandCode": "CARB2000044",
			"carBrandName": "周品牌1",
			"carSeriesCode": "CARS2000063",
			"carSeriesName": "周车系1",
			"carModelCode": "CARM2000088",
			"carModelName": "周车型1",
			"carOpvCode": "CAROPV2000026",
			"carOpvName": "周排量1",
			"carIotypeCode": "CARIO2000018",
			"carIotypeName": "周进气1",
			"repairCustomCode": null,
			"repairCustomName": null,
			"repairMobilePhone": null,
			"currentMileage": null,
			"orderStatus": null,
			"isCancel": null,
			"orderRemark": null,
			"outMileage": null,
			"bookOrderServiceDetailInfos": null,
			"bookOrderSkuDetailInfos": null,
			"leadCode": null,
			"createByName": null,
			"createTimeStr": null,
			"bookingEnteringTimeStr": null
		},
		"bookOrderServiceDetailInfos": null,
		"bookOrderServiceDetailSkuInfos": null,
		"bookOrderSkuDetailInfos": null
	}
})
let queryAllInfo =  Mock.mock('https://thf.queryAllInfo.htm',
{
	"code": "success",
	"message": "success",
	"obj": {
		limitDay: 2
	}
})
let getCategoryInfoByStoreCode =  Mock.mock('https://thf.getCategoryInfoByStoreCode.htm',
{
	"code": "success",
	"message": "success",
	"obj": [{
		"id": null,
		"isDeleted": "0",
		"createBy": null,
		"createTime": null,
		"updateBy": null,
		"updateTime": 1530948994609,
		"createOrgCode": null,
		"pageStart": 1,
		"pageNums": 2,
		"empToken": null,
		"remark": null,
		"relationCode": null,
		"storeCode": null,
		"storeName": null,
		"serviceCode": "S000306",
		"serviceName": null,
		"categoryName": "推荐服务",
		"categoryCode": "000090",
		"categoryFlag": 0,
		"channelType": null,
		"updateTimeStr": "2018-07-099999 15:36:34"
	}, {
		"id": null,
		"isDeleted": "0",
		"createBy": null,
		"createTime": null,
		"updateBy": null,
		"updateTime": 1530948994620,
		"createOrgCode": null,
		"pageStart": 1,
		"pageNums": 2,
		"empToken": null,
		"remark": null,
		"relationCode": null,
		"storeCode": null,
		"storeName": null,
		"serviceCode": "S000208",
		"serviceName": null,
		"categoryName": "整形",
		"categoryCode": "000054",
		"categoryFlag": 1,
		"channelType": null,
		"updateTimeStr": "2018-07-07 15:36:34"
	}, {
		"id": null,
		"isDeleted": "0",
		"createBy": null,
		"createTime": null,
		"updateBy": null,
		"updateTime": 1530948994620,
		"createOrgCode": null,
		"pageStart": 1,
		"pageNums": 2,
		"empToken": null,
		"remark": null,
		"relationCode": null,
		"storeCode": null,
		"storeName": null,
		"serviceCode": "S000208",
		"serviceName": null,
		"categoryName": "其它",
		"categoryCode": "000054",
		"categoryFlag": 1,
		"channelType": null,
		"updateTimeStr": "2018-07-07 15:36:34"
	}]
})

let getServiceInfoByStoreCodeAndCategoryCode =  Mock.mock('https://thf.getServiceInfoByStoreCodeAndCategoryCode.htm',
{
	"code": "success",
	"message": "success",
	"obj": // ['推荐服务List', '中间项目', '其它'] 接口待调整
	[
		{
			"id": null,
			"isDeleted": "0",
			"createBy": null,
			"createTime": null,
			"updateBy": null,
			"updateTime": 1530601402777,
			"createOrgCode": null,
			"pageStart": 1,
			"pageNums": 2,
			"empToken": null,
			"remark": null,
			"relationCode": null,
			"storeCode": null,
			"storeName": null,
			"serviceCode": null,
			"serviceName": '轮胎保养',
			"categoryName": null,
			"categoryCode": null,
			"categoryFlag": null
		},
		{
			"id": null,
			"isDeleted": "0",
			"createBy": null,
			"createTime": null,
			"updateBy": null,
			"updateTime": 1530601402777,
			"createOrgCode": null,
			"pageStart": 1,
			"pageNums": 2,
			"empToken": null,
			"remark": null,
			"relationCode": null,
			"storeCode": null,
			"storeName": null,
			"serviceCode": null,
			"serviceName": '气压检测',
			"categoryName": null,
			"categoryCode": null,
			"categoryFlag": null
		}
	]			
})
// let queryAllInfo =  Mock.mock('https://thf.queryAllInfo.htm',
// {
// 	"code": "success",
// 	"message": "success",
// 	"obj": {
// 		limitDay: 2
// 	}
// })

export { insertOrUpdateBookOrderInfo, getServiceInfoByStoreCodeAndCategoryCode,
	queryAllInfo, getCategoryInfoByStoreCode }