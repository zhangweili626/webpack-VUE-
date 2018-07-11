import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from '../common/logger'
import login from './login/store'
import supplier from './supplier/store'
import suitscope from './suitscope/store'
import accounting from './accounting/store'
import checkplan from './checkplan/store'
import allotin from './allotin/store'
import storeStation from './store-station/store'
import purchasecontract from './purchasecontract/store'
import staff from './staff/store'
import skuCar from './skucar/store'
import blitem from './blitem/store'
import storemanage from './storemanage/store'
import classification from './classification/store'
import serviceitem from './serviceitem/store'
import staffjobs from './staffjobs/store'
import serviceManhour from './service-manhour/store'
import allotout from './allotout/store'
import serviceStatic from './service-staticprice/store'
import skuComb from './skuComb/store'
import demandOrder from './demandorder/store'
import ownPurchase from './store-ownpurchase/store'
import checkTemplate from './check-template/store'
import cardPay from './card-pay/store'
import refund from './refund/store'
import backCard from './back-card/store'
import saleDiscount from './sale-discount/store'
import purchaseReturn from './purchase-return/store'
import stockAdjust from './stock-adjust/store'
import workOrder from './work-order/store'
import finance from './finance/store' //引入finance模块
import storeRequisition from './storeRequisition/store'
import appointment from './appointment/store'

const env = process.env.NODE_ENV
Vue.use(Vuex)
const debug = env == 'development' //错误日志的（我也不懂）
export default new Vuex.Store({
    modules: { //在这里注册模块
        finance,
        login,
        supplier,
        suitscope,
        accounting,
        checkplan,
        allotin,
        storeStation,
        purchasecontract,
        blitem,
        storemanage,
        classification,
        staff,
        skuCar,
        serviceitem,
        staffjobs,
        serviceManhour,
        allotout,
        serviceStatic,
        skuComb,
        demandOrder,
        ownPurchase,
        checkTemplate,
        cardPay,
        refund,
        backCard,
        saleDiscount,
        purchaseReturn,
        stockAdjust,
        workOrder,
        storeRequisition,
        appointment,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})