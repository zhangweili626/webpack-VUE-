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
// 预约单新增返回接口数据 start
let insertOrUpdateBookOrderInfo = Mock.mock('https://thf.insertOrUpdateBookOrderInfo.htm',{
	"code": "success",
	"message": "success",
	"obj": {
		"id": null,
		"isDeleted": "0",
		"createBy": null,
		"createTime": null,
		"updateBy": null,
		"updateTime": 1530873577221,
		"createOrgCode": null,
		"pageStart": 1,
		"pageNums": 2,
		"empToken": null,
		"bookOrderInfoVo": { // 预约单信息表
		"id": "1fd9c41da4fd462fb4e865fa07dad14a",
		"isDeleted": "0",
		"createBy": "EMP000001",
		"createTime": 1525678105000,
		"updateBy": "EMP000001",
		"updateTime": 1525678105000,
		"createOrgCode": "1223",
		"pageStart": 1,
		"pageNums": 2,
		"empToken": "165ce426309b456491a51c2d2c1d16c5",
		"remark": null,
		"bookOrderNo": "BOI2018070602014311",
		"orderNo": null,
		"storeCode": "STORE2000905",
		"storeName": "售后测试门店C",
		"businessTypeCode": "CarWash",
		"businessTypeName": "洗车",
		"channelTypeCode": "ShopReservation",
		"channelTypeName": "门店预约",
		"bookingEnteringTime": null,
		"bookingConfirmTime": null,
		"bookOrderPrice": null,
		"salesEmpCode": "EMP2000512",
		"salesEmpName": "testc1",
		"custCode": "CUSTOM2006105",
		"custName": "李海军",
		"custPhone": null,
		"custMobile": "13222222222",
		"vehicleCode": "CV20180620000526",
		"custPlates": "沪A54657b",
		"vinCode": "地方个地方3223424",
		"carCode": "CAR2000026",
		"carName": null,
		"carDisplayName": "东风东风本田炫威XR-V1.8L自然吸气1.8L2016款舒适手动版",
		"carFactoryCode": "CARF022251",
		"carFactoryName": "东风",
		"carBrandCode": "CARB2000004",
		"carBrandName": "东风本田",
		"carSeriesCode": "CARS2000026",
		"carSeriesName": "炫威",
		"carModelCode": "CARM2000004",
		"carModelName": "XR-V1.8L",
		"carOpvCode": "CAROPV022243",
		"carOpvName": "1.8L",
		"carIotypeCode": "CARIO80001",
		"carIotypeName": "自然吸气",
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

export { insertOrUpdateBookOrderInfo }