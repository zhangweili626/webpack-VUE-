<template>
  <ol class="breadcrumb">
    <li class="breadcrumb-item" v-for="(item, index) in list" :key="index">
      <span class="active" v-if="isLast(index)">{{ showName(item) }}</span>
      <a href="/livepro/index" v-else-if="index == 0">{{ showName(item) }}</a>
      <router-link :to="getPath(index, item.path)" v-else>{{ showName(item) }}</router-link>  
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    ifFirst (index) {
      return index === 0
    },
    isLast (index) {
      return index === this.list.length - 1
    },
    getPath (index, path) {
        if(index === 0) {
           return '/'
        } else {
           return path
        }
    },
    showName (item) {
      if (item.meta && item.meta.text && item.meta.label && this.$route.params.code) {
        item = item.meta.text;
      }
      if (item.meta && item.meta.label) {
        item = item.meta && item.meta.label
      }

      if (item.name) {
        item = item.name
      }
      return item
    }
  }
}
</script>
