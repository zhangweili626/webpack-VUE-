import api from './api'
import { Message } from 'element-ui'
import config from 'common/config'
import common from 'common/common'

const parserDate = function (date) { 
    var t = Date.parse(date);  
    if (!isNaN(t)) {  
        return new Date(Date.parse(date.replace(/-/g, "/")));  
    } else {  
        return new Date();  
    }  
}

export function getType(code, success) {
    const params = {refCode: code}
    api.ref.getDataDictionarys(params, res => {
        if(res.data.code === 'success' && res.data.obj) {
            let items = res.data.obj.referenceDetailInfos                
            if(items) {
                success(items)
            }
        }
    })
}

export function getSequence(code, result) {
    const params = {serviceCode: code}
    api.ordinalInfo.getSequence(params, (res) => {
        if(res.data.code === 'success') {
            result(res.data.obj)
        }
    })
}
//serviceCode 业务应用编码 String
//getNums 	一次请求批量获取SEQ的个数	integer
export function getSequenceList(params, result) {
    api.ordinalInfo.getSequenceList(params, (res) => {
        if(res.data.code === 'success') {
            result(res.data.obj)
        }
    })
}

export function formatDate(date) {  
    if(typeof date === 'string' && date) {
        return parserDate(date)
    }else if(typeof date === 'object') {
        let y = date.getFullYear();  
        let m = date.getMonth() + 1;  
        m = m < 10 ? `0${m}` : m;  
        let d = date.getDate();  
        d = d < 10 ? `0${d}` : d;  
        return `${y}-${m}-${d}` 
    }else {
        return ''
    } 
}

export function format(date) {
    if(typeof date === 'string' && date) {
        if(date[10] === 'T') {
            let oTime = date.slice(0, 10)
            let dat = new Date(oTime)
            let y = dat.getFullYear();  
            let m = dat.getMonth() + 1;  
            m = m < 10 ? `0${m}` : m;  
            let d = dat.getDate() + 1;  
            d = d < 10 ? `0${d}` : d;  
            return `${y}-${m}-${d}`
        }else {
            return date.slice(0, 10)
        }
    }else if(typeof date === 'object' && date !=  null) {
        let y = date.getFullYear();  
        let m = date.getMonth() + 1;  
        m = m < 10 ? `0${m}` : m;  
        let d = date.getDate();  
        d = d < 10 ? `0${d}` : d;  
        return `${y}-${m}-${d}` 
    }else {
        return ''
    }
}

export function alertSuccess(res, next = () => {}) {
    if (res.data.code === 'success') {
        Message({
            type: 'success',
            message: config.messInfo.success
        })
        next(res)
    }
}

export function isSelected(i, next) {
    if(i === -1) {
        Message({
            type: 'warning',
            message: '请选择'
        })
        return
    }else {
        next()
    }
}

export function hasBtn(url) {
    let userInfo = JSON.parse(common.getSession('userInfo'))
    if(!userInfo) {
        return false
    }
    if(userInfo.hasOwnProperty('menuUrls')) {
        const _urlMap = userInfo.menuUrls
        return _urlMap.hasOwnProperty(`/api${url}`) 
    }else {
        return false
    }
}
// 数组对象去重
export function filter(arr, prop) {
    let i = 0,
        res = [],
　　    json = {}
　　 for(; i<arr.length; i++) {
　　　　if(!json[arr[i][prop]]) {
　　　　　　res.push(arr[i])
　　　　　　json[arr[i][prop]] = 1
　　　　}
　　 }
　　 return res;
}

export function getWaitTime(createTime, currentTime) {
    let time = new Date(currentTime).getTime() - createTime,
        hourTime =  1000 * 60 * 60,
        dayTime = 1000 * 60 * 60 * 24, 
        _hour = time / hourTime > 23 ? parseInt(time / hourTime) : `${parseInt(time / hourTime)}`,
        minute = Math.ceil(time % hourTime / 60000),
        _minute = minute >= 10 ? minute : `0${minute}`,
        day = Math.round(time % dayTime / dayTime),
        _day = day >= 10 ? day : `0${day}`

    if(time / (dayTime * 31) >= 1) {
        return `${parseInt(time / (dayTime * 31))}月 ${_day}天`
    }else if(time / dayTime >= 1) {
        return `${parseInt(time / dayTime)} 天`
    }else if(time / hourTime >= 1) {
        return `${_hour}:${_minute}`
    }else {
        return `00:${_minute}`
    }
}

export function timeMove(waitTime) {
    let hours = waitTime.split(':')[0]
    let min = waitTime.split(':')[1]
    if(hours == 24) {
        waitTime = '1天'
    }
    if((parseInt(hours) * 60 + parseInt(min)) < 24 * 60) {
        if(min >= 59) {
            min = '0' 
            hours = parseInt(hours) + 1
        }
        if(min != '0') {
            min = parseInt(min) + 1
        } 
        hours =  hours >= 10 ? hours : `0${hours}`,
        min = min >= 10 ? min : `0${min}`,
        waitTime = `${hours}:${min}`
    }
}
// 获取数组中重复个数
export function getCount(item, list) {
    let count = 1,
        map = {}
    for(var i = 0; i < list.length; i ++) {
        if(!map[list[i]]) {
            map[list[i]] = 1
        }else {
            if(list[i] === item) {
                count++
            }
        }
    }
    return count
}
// 获取数组中重复个数 通过属性
export function getCountByProp(item, list, prop) {
    let count = 1,
        map = {}
    for(var i = 0; i < list.length; i ++) {
        if(!map[list[i][prop]]) {
            map[list[i][prop]] = 1
        }else {
            if(list[i][prop] === item[prop]) {
                count++
            }
        }
    }
    return count
}

export function getDateRange(startDate, day) {
    if(!startDate) {
        return ''
    }
    let _startDate = new Date(startDate)
    let endDate = new Date(_startDate.getFullYear(), _startDate.getMonth(), _startDate.getDate()+day)
    let sy = _startDate.getFullYear() 
    let sm = _startDate.getMonth() + 1   
    let sd = _startDate.getDate()
    sm = sm < 10 ? `0${sm}` : sm 
    sd = sd < 10 ? `0${sd}` : sd
    let y = endDate.getFullYear() 
    let m = endDate.getMonth() + 1   
    let d = endDate.getDate()
    m = m < 10 ? `0${m}` : m 
    d = d < 10 ? `0${d}` : d
    return `${sy}-${sm}-${sd} ~ ${y}-${m}-${d}`
}

export function dateDiff(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    let dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
}

export function findTextByValue(value, list) {
    let text = ''
    list.forEach(item => {
        if(value === item.value) {
            text = item.text
        }
    })
    return text
}
  
export function findValueByText(text, list) {
    let value = ''
    list.forEach(item => {
        if(text === item.text) {
            value = item.value
        }
    })
    return value
}

export function formatMoney(s, n) {  
    n = n > 0 && n <= 20 ? n : 2;  
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
    let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];  
    let t = "";  
    for (let i = 0; i < l.length; i++) {  
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
    }  
    return t.split("").reverse().join("") + "." + r;  
} 