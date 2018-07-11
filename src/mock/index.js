// 引入mockjs
const Mock = require('mockjs');
import collectionApi from 'common/api-collection.js'
import api from 'common/api.js'

import common from "common/common.js"
Mock.mock('/penghuwan.com/ ', 'post', {
	'code': 'success',
	'message': 'success',
	// 属性 list 的值是一个数组，其中含有 1 到 10 个元素
	'obj|2': [{
		'id|+1': 1,
		'name': '@image',
		'age|10-40': 1
	}]
  })
Mock.mock('/ceshi.com/1','post',{
	'code':'success',
	'message':'success',
	'obj':{
		'list|1-5': [{          // 数组成员1-5个
			'str1|2': 'str',   	// 重复2次数
			'str2|1-5': 'str', 	// 重复1-5次数
			'num1|+1': 1, 		// 每次自增1
			'num2|1-100': 1, 	// 1-100随机取值
			'num3|1-100.1-3': 1, 	// 整数部分1-100随机取值，小数部分取1-3位
			'boolean|1/3': true, 	// 为true的概率为1/3
			'regexp': /[a-z][A-Z][0-9]/, // 正则取值
			'id|+1': 1,
			'billCode|10001-1000001':10004,
		}]
	}
})
/*券管理*/
Mock.mock(common.isdev()+'/v2/cardcoupons/coupons/queryCouponInfos.htm','post',{
	'code':'success',
	'message':'success',
	'obj':{
		'total':100,
		'pages':10,
		'pageNo|+1':1,
		'list|10':[{
			'frozenState':'0',
			'couponUseTypeName':'折扣券',
			'storeName':'门店',
			'couponNo|10001-1000001':5,
		}]
	}
})

// 预约单历史记录
Mock.mock(collectionApi.appointment.queryBookOrderHistoryList,'post',{
	'code':'success',
	'message':'success',
	'obj':{
		'list|1-5': [{         
			currentMileage: 1000,
			confirmTime: '2018-09-11',
			historyOrderNo: '12122',
			storeName: '333',
			custPlates: '沪1212',
			carDisplayName: '奔驰',
			serviceName: '洗车',
			bookOrderPrice: '￥777',
			orderStatus: 0,
			bookOrderStatus: 0,
			isBookOrder: 0,
		}]
	}
})
// 预约单推荐服务查询
Mock.mock(collectionApi.storeAppointmentService.queryStoreServiceInfos, 'post',{
	'code':'success',
	'message':'success',
	'obj':{
		'list|1-5': [{         
			'storeCode|1-5': '102',
			'storeName': Mock.mock('@string()'),
			'serviceCode|1-5': '201',
			'serviceName': Mock.mock('@string()'),
		}],
		'total': 10,
		'pages': 1,
	}
})
Mock.mock(common.isdev() + '/v2/aftersales/book/insertOrUpdateBookOrderInfo.htm','post',{
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