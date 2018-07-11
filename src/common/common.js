export default {
    isdev: function(env) {
        var env = process.env.NODE_ENV;
        return env === 'development' ? '/cxb/api' : '/api';
    },
    isweb: function(env) {
        var env = process.env.NODE_ENV;
        return env === 'development' ? '' : '/web';
    },
    islivePro: function(env) {
        var env = process.env.NODE_ENV;
        return env === 'development' ? '' : '/livepro';

    },
    isliveCs: function(env) {
        var env = process.env.NODE_ENV;
        return env === 'development' ? '' : '';
    },
    /* 设置cookie函数 */
    setCookie: (key, value, day) => {
        var date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = key + '=' + escape(value) + ';expires=' + date;
    },
    /* 获取cookie函数 */
    getCookie: (key) => {
        var coo = unescape(document.cookie); //解码
        var arr1 = coo.split('; '); //第一次分解后是数组
        for (var i = 0; i < arr1.length; i++) { //第二次循环拆分数组
            var arr2 = arr1[i].split('=');
            if (arr2[0] == key) {
                return arr2[1];
            }
        }
    },
    parseData: function(data) {
        var _data;
        if (!data) return data;
        try {
            _data = JSON.parse(data);
        } catch (e) {
            _data = data;
        }
        return _data;
    },
    /* 删除cookie */
    removeCookie: (key) => {
        setCookie(key, '', -1);
    },
    /* 获取session storage**/
    getSession: (key) => {
        return sessionStorage.getItem(key)
    },
    /* 设置session storage值**/
    setSession: (key, value) => {
        sessionStorage.setItem(key, value)
    },
    /* 清空session storage 数据项**/
    removeSessionItem: (key) => {
        sessionStorage.removeItem(key)
    },
    /**清空session storage**/
    clearSession: () => {
        sessionStorage.clear()
    },
    previewNeed: (URL, PARAMMS) => {
        var temp_form = document.createElement("form");      
            temp_form.action = URL;     
            temp_form.target = "_blank";
            temp_form.method = "post";      
            temp_form.style.display = "none"; 
            var opt = document.createElement("input");
            opt.name = 'dataJson';    
            opt.value = '"' + JSON.stringify(PARAMMS) + '"';
            temp_form.appendChild(opt);
            document.body.appendChild(temp_form);    
            temp_form.submit();     
    },
    printPreview(url, params) {
        var temp_form = document.createElement("form")     
        temp_form.action = url      
        temp_form.target = "_blank"
        temp_form.method = "post"   
        temp_form.style.display = "none"
        var opt = document.createElement("input")
        opt.name = params.name      
        opt.value = params.value
        temp_form.appendChild(opt)
        document.body.appendChild(temp_form)    
        temp_form.submit()    
    },
    getRemainderTime(startTime,endTime){
        var s1 = new Date(startTime),
        s2 = new Date(endTime),
        runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
        var year = Math.floor(runTime / 86400 / 365);
        runTime = runTime % (86400 * 365);
        var month = Math.floor(runTime / 86400 / 30);
        runTime = runTime % (86400 * 30);
        var day = Math.floor(runTime / 86400);
        runTime = runTime % 86400;
        var hour = Math.floor(runTime / 3600);
        runTime = runTime % 3600;
        var minute = Math.floor(runTime / 60);
        runTime = runTime % 60;
        var second = runTime;
        return {
            year:year,
            month:month,
            day:day,
            hour:hour,
            minute:minute,
            second:second
        }
    },
    // alertInfo(type, message) {
    //     var obj = {
    //         'error': '内容尚未填写完整',
    //         'warning': '操作失败',
    //         'success': "操作成功",
    //         'info': message
    //     };
    //     Message({
    //         message: obj[type],
    //         type: type
    //     })
    // },


  protocol: function () {
    return window.location.protocol + '//';
  },
  isTel: function(val){
    var flag = (/\d{6,}$/.test(val));
    return flag;
  },
  isMobile: function(val){
    var flag = (/^1(3|4|5|7|8)\d{9}$/.test(val));
    return flag;
  },
  isCardNum: function(val){
    var flag = (/^[A-Za-z0-9]+$/.test(val));
    return flag;
  },
  //字母排序 wang
  by:function(name, minor){
    return function(o,p){
      var a,b;
      if(o && p && typeof o === 'object' && typeof p ==='object'){
        a = o[name];
        b = p[name];
        if(a === b){
          return typeof minor === 'function' ? minor(o,p):0;
        }
        if(typeof a === typeof b){
          return a < b ? -1:1;
        }
        return typeof a < typeof b ? -1 : 1;
      }else{
        thro("error");
      }
    }
  },
  //时间
  eleTimeFormat:function(str){
    if(typeof str != 'object')return;
    var obj = new Date(str),
        y = obj.getFullYear(),
        m = obj.getMonth()+1,
        d = obj.getDate();
        m = m <10?'0' + m:m;
        d = d <10?'0' + d:d;

    return y + '-' + m + '-' + d;
  },
  eleTimeFormatim2:function(str){
    if(typeof str != 'object')return;
    var obj = new Date(str),
        y = obj.getFullYear(),
        m = obj.getMonth()+1,
        d = obj.getDate(),
        h = obj.getHours(),
        min = obj.getMinutes(),
        sec = obj.getSeconds();
        m = m <10?'0' + m:m;
        d = d <10?'0' + d:d;
        h = h <10?'0' + h:h;
        min = min <10?'0' + min:min;
        sec = sec <10?'0' + sec:sec;
    return y + '-' + m + '-' + d + ' ' + h +':'+min+':'+sec;
  },
  // 浮点型小数放大处理问题
  dealNumberWithPoint: function(num1,num2) {
    // debugger
    let tempMax = (num1 - 0) + ''
    let arrMax = tempMax.split('.')
    let maxLain
    if(arrMax.length === 1){
        maxLain = (arrMax.join('') - 0) * 100
    }else {
        let maxAgain =arrMax[1].split('')
        if(maxAgain.length === 1) {
            maxAgain.push('0')
        }
        maxAgain.splice(2, 0, '.')
        maxLain = (arrMax[0] + maxAgain.join('')) - 0
    }
    if(num2) {
        maxLain = maxLain.toFixed(num2)
    }
    return maxLain
  },
  // 浮点型小数缩小处理问题
  dealNumberWithSmall: function(num1, num2) {
    let tempMin = (num1 - 0) + ''
    let minMain = tempMin.split('.')
    let arrOne = ['0', '.']
    let arrTwo = ['0', '0', '.']
    let minArr = minMain[0].split('')
    if(minMain.length === 1) {
        if(minArr.length > 2) {
            minArr.splice(minArr.length-3, 0, '.')
        }else if(minArr.length === 2) {
            minArr = arrOne.concat(...minArr)
        }else {
            minArr = arrTwo.concat(...minArr)
        }
    }else {
        if(minArr.length > 2) {
            minArr.splice(minArr.length-3, 0, '.')
            minArr = minArr.concat(minMain[1])
        }else if(minArr.length === 2) {
            minArr = arrOne.concat(...minArr).concat(minMain[1])
        }else {
            minArr = arrTwo.concat(...minArr).concat(minMain[1])
        }
    }
    let importValue = minArr.join('') - 0
    if(num2) {
        importValue = importValue.toFixed(num2)
    }
    return importValue
  },
  getUploadUrl(){
    const origin = window.location.origin;
    var env = process.env.NODE_ENV;
    return env === 'development' ? 'http://sit.iris.com' : origin;
  },
  getShowFactory() {
    let a = sessionStorage.getItem('showFactory') == 'true'?true:false;
    return a;
  },
  // 格式化element时间的组件  转成 YYYY-MM-DD格式的
  formattingTime(arg) {
      let judge = Array.isArray(arg)
      if(judge) {
        let startDate = new Date(arg[0])
        let endDate = new Date(arg[1])
        let startYear = startDate.getFullYear()
        let startMonth = startDate.getMonth() + 1
        let startDay = startDate.getDate()

        let endYear = endDate.getFullYear()
        let endMonth = endDate.getMonth() + 1
        let endDay = endDate.getDate()

        let startTime = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth)) + '-' + (startDay > 9 ? startDay : ('0' + startDay))
        let endTime = endYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth)) + '-' + (endDay > 9 ? endDay : ('0' + endDay))
        return {
            startTime,
            endTime
        }
      }else {
          return
      }
  },
  formattingTime2(arg) {
      let judge = Array.isArray(arg)
      if(judge) {
        let startDate = new Date(arg[0])
        let endDate = new Date(arg[1])
        let startDateh = startDate.getHours()
        let startDatemin = startDate.getMinutes()
        let startDatesec = startDate.getSeconds()

        let endDateh = endDate.getHours()
        let endDatemin = endDate.getMinutes()
        let endDatesec = endDate.getSeconds()

        startDateh = startDateh <10?'0' + startDateh:startDateh
        startDatemin = startDatemin <10?'0' + startDatemin:startDatemin
        startDatesec = startDatesec <10?'0' + startDatesec:startDatesec

        endDateh = endDateh <10?'0' + endDateh:endDateh
        endDatemin = endDatemin <10?'0' + endDatemin:endDatemin
        endDatesec = endDatesec <10?'0' + endDatesec:endDatesec

        let startTime = startDateh +':'+startDatemin+':'+startDatesec
        let endTime = endDateh +':'+endDatemin+':'+endDatesec
        return {
            startTime,
            endTime
        }
      }else {
          return
      }
  },
  	//获取当前系统时间
	getTime(){
	    var obj = new Date(),
	        y = obj.getFullYear(),
	        m = obj.getMonth()+1,
	        d = obj.getDate(),
	        h = obj.getHours(),
	        min = obj.getMinutes(),
	        sec = obj.getSeconds();
	        m = m <10?'0' + m:m;
	        d = d <10?'0' + d:d;
	        h = h <10?'0' + h:h;
	        min = min <10?'0' + min:min;
	        sec = sec <10?'0' + sec:sec;
	    return y + '-' + m + '-' + d + ' ' + h +':'+min+':'+sec;
  	},
    // 比较两个数组是指是否相同
    compareArr(a,b) {
        if(a.length != b.length) {
            return false;
        }else {
            let num = 0;
            for (let [i, val] of a.entries()) {
            let tt =  b.findIndex((v) => {
                    return JSON.stringify(v) === JSON.stringify(val)
                })
                if(tt > -1) {
                    num++;
                }else {
                    return false;
                }
            }
            if(num == a.length) {
                return true;
            }
        }

    },
    // 去除前后空格
    removeBlank(arg) {
        return arg.replace(/(^\s*)|(\s*$)/g, "")
    },
    //  智能搜索过滤数组（并集）
    filterArr(arg1, arg2) {
        // arg1为要过滤的数据  arg2过滤的条件  backArr 过滤之后返回的数据
        let judgeArg1 = false
        let judgeArg2 = false
        let backArr = []
        if(arg1 && Array.isArray(arg1)) {
            judgeArg1 = true
        }else {
            judgeArg1 = false
        }
        if(arg2 && Object.prototype.toString.call(arg2) === "[object String]") {
            judgeArg2 = true
        }else {
            judgeArg2 = false
        }
        if(judgeArg1 && judgeArg2) {
            let tempArrOne = common.removeBlank(arg2).split(' ')
            let tempArrTwo = []
            tempArrOne.forEach(element => {
                if(element) {
                    tempArrTwo.push(element)
                }
            })
            for(let i = 0; i< arg1.length; i++) {
                let judge = true
                let judgeStr
                if(Object.prototype.toString.call(arg2) === "[object Object]") {
                    judgeStr = JSON.stringify(arg1[i])
                }else if(Object.prototype.toString.call(arg2) === "[object String]") {
                    judgeStr = arg1[i]
                }else {
                    return
                }
                for(let j = 0; j< tempArrTwo.length; j++) {
                    if(!judgeStr.includes(tempArrTwo[j])) {
                        judge = false
                    }
                }
                if(judge) {
                    backArr.push(arg1[i])
                }
            }
        }
        return backArr
    },

    // 智能搜索过滤数组（交集）
    filterArrOfAnd(arg1, arg2) {
        // arg1为要过滤的数据  arg2过滤的条件  backArr 过滤之后返回的数据
        let judgeArg1 = false
        let judgeArg2 = false
        let backArr = []
        if(arg1 && Array.isArray(arg1)) {
            judgeArg1 = true
        }else {
            judgeArg1 = false
        }
        if(arg2 && Object.prototype.toString.call(arg2) === "[object String]") {
            judgeArg2 = true
        }else {
            judgeArg2 = false
        }
        if(judgeArg1 && judgeArg2) {
            let tempArrOne = arg2.split(' ');
            for(let j = 0; j< tempArrOne.length; j++) {
                for(let i = 0; i< arg1.length; i++) {
                    if(JSON.stringify(arg1[i]).includes(tempArrOne[j])) {
                        backArr.push(arg1[i]);
                    }
                };
                arg1 = JSON.parse(JSON.stringify(backArr));
                if(j < tempArrOne.length - 1){
                    backArr = [];
                }
            }
        }
        return backArr;
    }
}


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };


    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[ k ])
                : (("00" + o[ k ]).substr(("" + o[ k ]).length)))
        }
    }
    return fmt
}
