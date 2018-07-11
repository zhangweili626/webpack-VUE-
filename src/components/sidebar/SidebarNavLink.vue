<template>
  <div>
    <router-link v-if="isNative"  :to="url" class="nav-link">
        <i class="SidebarNavLink" :class="icon"></i> {{name}}
    </router-link>
    <a v-else class="nav-link" @click="navLink(url)"><i class="SidebarNavLink" :class="icon"></i> {{name}}</a>
  </div>
  </template>
<script>
export default {
  name: "sidebar-nav-link",
  props: {
    name: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    badge: {
      default: ""
    },
    isNative:{
      default: false      
    }
  },
  methods:{
    navLink(url){
      window.location.href = url
    }
  }
};
</script>
<style>
.SidebarNavLink {
  color: aliceblue !important;
  margin-left: 15px !important;
  margin-right: 0 !important;  
}
.second-link {
  text-indent: 15px;
}
.third-link {
  overflow: hidden;
}
.third-link .nav-link {
  display: block !important;
  line-height: 45px;
  height: 45px;
  padding: 0 10px 0 32px !important;
}
</style>
