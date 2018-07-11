import Vue from 'vue'
Vue.directive(
    'numberOnly', {
        bind: function(el) {
            el.handler = function() {
                el.value = el.value.replace(/[^0-9\.]/g, '')
            }
            el.addEventListener('input', el.handler)
        },
        unbind: function(el) {
            el.removeEventListener('input', el.handler)
        }
    }
);
Vue.directive(
    'invioceNo', {
        bind: function(el) {
            el.handler = function() {
                var formatVal = /[^0-9A-Z]+/g;  
                el.value = el.value.replace(formatVal, '');            
            }
            el.addEventListener('input', el.handler)
        },
        unbind: function(el) {
            el.removeEventListener('input', el.handler)
        }
    }
);
Vue.directive(
    'numberInput', {
        bind: function(el) {
            el.handler = function() {
                el.value = el.value.replace(/\D+/g, '')
            }
            el.addEventListener('input', el.handler)
        },
        unbind: function(el) {
            el.removeEventListener('input', el.handler)
        }
    }
)