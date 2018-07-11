<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div class="user-info">
        <div>
          <div class="user-photo"><img src="/static/image/userimg.jpg" alt=""></div>
        </div>
        <div class="user-info-name">
          <div>
            <b-dropdown id="ddown1" :text="orgName+'-'+empCnName">
              <b-dropdown-item @click="Org()" v-show="flag">
                <i class="fa fa-users"></i> 切换组织
              </b-dropdown-item>
              <b-dropdown-item @click="changePwd()">
                <i class="fa fa-shield"></i> 修改密码
              </b-dropdown-item>
              <b-dropdown-item @click="loginOut()">
                <i class="fa fa-lock"></i> 退出
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="navbar-text navbar">导航</div>      
      <ul class="nav">
        <li class="nav-item" v-for="(item, index) in arr" v-if="item.isDisplay != 0" :key="index">
          <template v-if="item.title">
            <SidebarNavTitle :name="item.name" />
          </template>
          <template v-else-if="item.divider">
            <li class="divider"></li>
          </template>
          <template v-else>
            <!-- 一级菜单并且有子菜单 -->
            <template v-if="item.children">
              <SidebarNavDropdown
                class="first-menu" 
                :opened="firstMenuIndex == index ? 'open' : ''" 
                :name="item.name" 
                :url="item.url" 
                :icon="item.icon"
              >
                <!-- 二级菜单 -->
                <template v-for="(child, i) in item.children" v-if="item.children.length && child.isDisplay != 0">
                  <SidebarNavDropdown
                    class="second-menu" 
                    v-if="!child.code"
                    :opened="secondMenuIndex == i ? 'open' : ''" 
                    :name="child.name" 
                    :url="child.url" 
                    :icon="child.icon" 
                    :key="child.code"
                  >
                    <!-- 三级菜单 -->
                    <li 
                      class="nav-item" 
                      v-for="(grandson, j) in child.children" 
                      @click="toGoMenu(grandson)" 
                      :key="j"
                    >
                      <SidebarNavLink
                        class="third-link" 
                        :class="{'nav-active': grandson.url === isCurrent}"
                        :name="grandson.name" 
                        :url="grandson.url" 
                        :isNative="grandson.isNative" 
                        :icon="grandson.icon" 
                        :badge="grandson.badge"
                        :title="grandson.name.length > 8 && grandson.name"
                      />
                    </li>
                  </SidebarNavDropdown>
                  <li class="nav-item" v-else @click="toGoMenu(child)" :key="child.code">
                    <SidebarNavLink
                      class="second-link" 
                      :class="{'nav-active': child.url === isCurrent}"
                      :name="child.name" 
                      :url="child.url" 
                      :isNative="child.isNative" 
                      :badge="child.badge"
                    />
                  </li>
                </template>
              </SidebarNavDropdown>
            </template>
            <!-- 一级菜单没有子菜单 -->
            <template v-else>
              <SidebarNavLink
                :class="{'nav-active':child.url === isCurrent}" 
                :name="item.name" 
                :url="item.url" 
                :isNative="item.isNative" 
                :icon="item.icon" 
                :badge="item.badge" 
              />
            </template>
          </template>
        </li>
      </ul>
      <slot></slot>
      <div slot="footer"></div>
    </nav>
  </div>
</template>
<script>
import SidebarNavDropdown from "./SidebarNavDropdown";
import SidebarNavLink from "./SidebarNavLink";
import SidebarNavTitle from "./SidebarNavTitle";
import Api from "../../common/api.js";
import common from "../../common/common.js";
import config from "../../common/config.js";
import menuInfo from "../../common/menuData.js";
import changeOrg from "../header/changeOrg.vue";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      firstMenuIndex: -1,
      secondMenuIndex: -1,
      pathName: window.location.pathname,
      arr: [],
      parentIndex: 0,
      childIndex: 0,
      isCurrent: "",
      flag: false,
      userInfo: {},
      orgName: "",
      empEnName: "",
      empCnName: "",
      showModal: false,
      orgTitle: "切换组织"
    };
  },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  created() {
    var _this = this;
    Api.toLogin.getUserMenu({}).then(function(res) {
      if (res.data.code == "success") {
        _this.creatMenuData(res.data.obj, menuInfo);
      }
    });
  },
  mounted() {
    this.redirectTo()
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if(this.userInfo) {
      this.defaultValue = this.userInfo.inCharegOrgVo.orgCode
    }
  },
  components: {
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    changeOrg
  },
  watch: {
    userInfo() {
      if (this.userInfo) {
        this.orgName = this.userInfo.inCharegOrgVo.orgName;
        this.empEnName = this.userInfo.empVo.empEnName;
        this.empCnName = this.userInfo.empVo.empCnName;
        this.flag = this.userInfo.orgCodes.length > 1 ? true : false;
      }
    }
  },
  methods: {
    ...mapActions("login", ["getUserInfo"]),
    Org() {
      this.$store.dispatch("finance/organize", true);
    },
    changePwd() {
      let url = window.location.href;
      this.$store.dispatch("login/getBackPage", url);
      this.$router.push({
        path: "/resetPassword"
      });
    },
    loginOut() {
      Api.toLogin.logout({}).then(res => {
        if (res.status == 200) {
          common.clearSession();
          window.location.href = window.location.origin + config.loginUrl;
        }
      });
    },
    handleClick(e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle("open");
    },
    toGoMenu(child) {
      this.isCurrent = child.url;
    },
    creatMenuData(data,menuInfo) {
      var info = data.info,
          _this = this;
      //子菜单与父菜单匹配归类,菜单顺序为数组顺序
      var menuCataLog = menuInfo.menuCataLog,
          config = menuInfo.menuMap;
      var menu = [];
      menu.length = 0;

      // 一级菜单
      for (let i=0, len = menuCataLog.length; i<len; i++) {
        menu.push({
          name: menuCataLog[i].modulName,
          icon: menuCataLog[i].iconClass,
          isOpen: false,
          isDisplay: 1,
          children: [],
        })

        const children = menuCataLog[i].children

        // 二级菜单
        for (let j=0; j<children.length; j++) {
          
          // 有三级菜单
          if (typeof children[j] == 'object') {
            menu[i].children.push({
              name: children[j].childName,
              isOpen: false,
              isDisplay: 1,
              children: [],
            })
            
            const grandson = children[j].textCode

            // 三级菜单
            for (let k=0; k<grandson.length; k++) {
              menu[i].children[j] && _this.initThirdMenu(info, menu[i].children[j].children, config, grandson[k], i, j)
            }
          }  
          
          // 没有三级菜单
          if (typeof children[j] == 'string') {
            _this.initThirdMenu(info, menu[i].children, config, children[j], i, j)
          }
        }
        
        // 如果三级菜单为空  则二级菜单不显示
        menu[i].children.forEach(item => {
          if (item.children && item.children.length == 0) {
            item.isDisplay = 0
          }
        })

        // 如果二级菜单里的三级菜单全为空，则不显示一级菜单
        const isShowFirstMenu = menu[i].children.every(item => {
          return item.isDisplay == 0
        })

        if (menu[i].children.length == 0 || isShowFirstMenu) menu[i].isDisplay = 0
      }
      _this.arr = menu
    },

    // 渲染三级菜单
    initThirdMenu(info, target, config, code, i, j) {
      if (info.hasOwnProperty(code)) {
        target.push({
          code,
          name: info[code].menuName,
          url: config[code].url,
          isNative: config[code].isNative,
          icon: 'iconfont icon-yuandianxiao',
          isOpen: false,
          isDisplay: 1
        })
      }
      if (this.isLocal() + config[code].url == this.pathName) {
        this.firstMenuIndex = i
        this.secondMenuIndex = j
        this.isCurrent = config[code].url
      }
    },
    
    isLocal() {
      if(process.env.NODE_ENV != 'development')
        return '/livecs'
      else 
        return ''
    },

    redirectTo() {
      if (process.env.NODE_ENV == 'development') {
        if (this.pathName == '/') {
          this.$router.push({path: 'appointment-new/appointment-edit'})
        }
      } else {
        if (this.pathName == '/' || this.pathName == '/livecs') {
          window.location.href = 'livepro/index'
        }
      }
    }
  }
};
</script>
