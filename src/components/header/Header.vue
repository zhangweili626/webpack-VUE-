<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <b-link class="navbar-brand">        
      <img class="black" src="/static/image/irislogo.jpg" alt="">
      <img class="white" src="/static/image/irislogo.png" alt="">
      </b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarMinimize">&#9776;</button>
    <b-nav  class="ml-auto">
    	<b-nav-item class="d-md-down-none mr-3" @click="showApprovalList">
      <i class="icon-envelope fs20"></i>
      <b-badge pill variant="danger">{{approvalNum}}</b-badge>
      </b-nav-item>
    <div id="now-time" class="now-time">
        <p class="time"><span class="iconfont icon-shijianicon"></span><span class="now-date">{{time}}</span><span class="MorningOrAfternoon">{{AMorPM}}</span></p>
        <p class="year">{{year}}<span>{{week}}</span></p>                
    </div>
    <!--  <b-nav-item class="d-md-down-none">
      <i class="icon-bell"></i>
      <b-badge pill variant="danger">5</b-badge>
      </b-nav-item>-->
      
      <!-- <b-nav-item-dropdown right class="margin-right-10">
        <template slot="button-content">
          <img :src="imgpath" class="img-avatar">
          <span class="d-md-down-none">{{orgName}}-{{empCnName}}</span>
        </template>
        <b-dropdown-item @click="Org()" v-show="flag"><i class="fa fa-users"></i> 切换组织</b-dropdown-item>
        <b-dropdown-item @click="changePwd()"><i class="fa fa-shield"></i> 修改密码</b-dropdown-item>
        <b-dropdown-item @click="loginOut()"><i class="fa fa-lock"></i> 退出</b-dropdown-item>
      </b-nav-item-dropdown> -->
    </b-nav>
    <div class="navbar-toggler"></div>
    <changeOrg ref="modal1" :title="orgTitle" :userInfo="userInfo" :size="size"></changeOrg>
    <approvalList ref="approvalModal" @sendNum = "getNum" @getNums = 'reloadNum'></approvalList>
  </header>
</template>
<script>
import Api from "../../common/api.js";
import common from "../../common/common.js";
import config from "../../common/config.js";
import changeOrg from "./changeOrg.vue";
import approvalList from "../../views/approval-flow/approval-list.vue";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      orgName: "",
      empEnName: "",
      empCnName: "",
      orgTitle: "切换组织",
      size: "",
      flag: false,
      imgpath: "/static/image/userimg.jpg",
      userInfo: {},
      defaultValue: "",
      year: "",
      time: "",
      AMorPM: "",
      week:"",
      approvalNum:null,
    };
  },
  computed: {
    ...mapState("finance", ["organize"])
  },
  created() {
    let _this = this;
    //获取用户信息
    // if(!sessionStorage.getItem('userInfo')) {
    // _this.getUserInfo({
    //   callback: userInfo => {
    //     Api.getUserAvailableInfo(res => {
    //       if(res.data.code === 'success') {
    //         userInfo.userAvailableInfo = res.data.obj

    //         sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    //         _this.userInfo = userInfo; 
    //         if(_this.userInfo){
    //           _this.defaultValue = _this.userInfo.inCharegOrgVo.orgCode;
    //         }
    //         this.initpath();
    //       }
    //     })
    //   }
    // })

    //this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // if(this.userInfo) {
    //   this.defaultValue = this.userInfo.inCharegOrgVo.orgCode
    // }
    //this.initpath()

    // } else {
    //     _this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    //     console.log('-----------用户信息----------')
    //     console.log(_this.userInfo)
    //     _this.defaultValue = _this.userInfo.inCharegOrgVo.orgCode
    // }
    // this.initpath();
    var fn = () => {
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var h = now.getHours();
      var mm = now.getMinutes();
      var s = now.getSeconds();
      var str;
      if (h > 12) {
        h -= 12;
        str = " PM";
      } else {
        str = " AM";
      }
      h = h < 10 ? "0" + h : h;
      d = d < 10 ? "0" + d : d;
      m = m < 10 ? "0" + m : m;
      mm = mm < 10 ? "0" + mm : mm;
      s = s < 10 ? "0" + s : s;
      var getWeek = now.getDay(); //注:0-6对应为星期日到星期六
      switch (getWeek) {
        case 0:
          this.week = "星期日";
          break;
        case 1:
          this.week = "星期一";
          break;
        case 2:
          this.week = "星期二";
          break;
        case 3:
          this.week = "星期三";
          break;
        case 4:
          this.week = "星期四";
          break;
        case 5:
          this.week = "星期五";
          break;
        case 6:
          this.week = "星期六";
          break;
        default:
          this.week = "系统错误！";
      }
      this.year = `${y}年${m}月${d}日`;
      this.time = `${h}:${mm}`;
      this.AMorPM = str;
    };
    fn();
    setInterval(fn, 30000);
    this.getNum()
  },
  components: {
    changeOrg,
    approvalList,
  },
  methods: {
    ...mapActions("login", ["getUserInfo"]),
    sidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-hidden");
    },
    sidebarMinimize(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-minimized");
    },
    mobileSidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-mobile-show");
    },
    asideToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("aside-menu-hidden");
    },
    loginOut() {
      Api.toLogin.loginOut({}).then(res => {
        // console.info(res);
        if (res.status == 200) {
          common.clearSession();
          window.location.href = common.getOrigin() + config.loginUrl;
        }
      });
    },
    Org() {
      this.$refs.modal1.showModal();
    },
    changePwd() {
      let url = window.location.href;
      this.$store.dispatch("login/getBackPage", url);
      this.$router.push({
        path: "/resetPassword"
      });
    },
    initpath() {
      this.imgpath = common.islivePro() + this.imgpath;
    },
    showApprovalList(){
    	this.$refs.approvalModal.showModal()
    },
    //获取推送消息的数量
    getNum(){
    	//this.$refs.approvalModal.getList()
    },
    //
    reloadNum(data){
    	this.approvalNum = data
    }
  },
  watch: {
    // userInfo() {
    //   if (this.userInfo) {
    //     if(!(typeof this.userInfo  == 'string') && (this.userInfo == 'undefined')){
    //       this.orgName = this.userInfo.inCharegOrgVo.orgName;
    //       this.empEnName = this.userInfo.empVo.empEnName;
    //       this.empCnName = this.userInfo.empVo.empCnName;
    //       this.flag = this.userInfo.orgCodes.length > 1 ? true : false;        
    //     }
    //   }

    // },
    organize() {
      // if (this.organize) {
        this.Org();
      //   this.$store.dispatch("finance/organize", false);
      // }
    }
  }
};
</script>
