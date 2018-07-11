import Vue from 'vue'
// 盘点单状态
Vue.filter('blitemStatus', function (val) {
    if (val == '0') {
        return '未盘点';
    } else if (val == '1') {
        return '盘点中';
    } else if (val == '10') {
        return '盘点中';
    } else if (val == '11') {
        return '盘点中';
    } else if (val == '20') {
        return '盘点中';
    } else if (val == '11') {
        return '盘点中';
    } else if (val == '9') {
        return '盘点完成';
    } else if (val == '-1') {
        return '盘点关闭';
    }
});

// 审批状态
Vue.filter('approStatus', function (val) {
    if (val == '0') {
        return '已提交';
    } else if (val == '1') {
        return '审批通过';
    } else if (val == '-1') {
        return '待提交';
    }
});

// 性别
Vue.filter('sex', function (val) {
    if (val == '0') {
        return '男';
    } else if (val == '1') {
        return '女';
    }
});

// 在职状态
Vue.filter('obJon', function (val) {
    if (val == '0') {
        return '离职';
    } else if (val == '1') {
        return '在职';
    }
});

// 员工状态
Vue.filter('empStatus', function (val) {
    if (val == 'FormalEmp') {
        return '正式员工';
    } else if (val == 'TempEmp') {
        return '临时员工';
    }
});

// 员工类型
Vue.filter('empStype', function (val) {
    if (val == 'empTypeGroupEmpType') {
        return '非生产性质员工';
    } else if (val == 'empTypeProductiveEmpType') {
        return '生产性质员工';
    }
});

// 单据状态
Vue.filter('ordeStatusFilter', function (val) {
    if (val == '0') {
        return '未生效';
    } else if (val == '1') {
        return '已提交';
    } else if (val == '2') {
        return '已生效';
    } else if (val == '3') {
        return '已完成';
    } else if (val == '-1') {
        return '已作废';
    }
});
