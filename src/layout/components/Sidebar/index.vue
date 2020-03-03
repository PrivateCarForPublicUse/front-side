<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        style="margin-top:10px"
      >
        <!--        <sidebar-item :item="aaa" style="font-size:22px">私车公用aaa</sidebar-item>-->
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Layout from '../../index'
import store from '@/store'
import { getToReviewNum } from '../../../api/master'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      userToReviewNum: 0,
      aaa: {
        path: '私车公用系统',
        component: Layout,
        children: [
          {
            path: '',
            meta: { title: '私车公用系统', icon: 'link' }
          }
        ]
      },
      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.fun()
    // this.timer = setInterval(this.fun, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    fun() {
      if (store.getters.roles < 0) return
      console.log('fun...')
      // 轮询 审核中的 用户、车辆、路程、报销 的数量
      getToReviewNum().then(response => {
        if (response.code === 200) {
          let data = response.data
          this.$store.state.user.userToReviewNum = data.userToReviewNum
          this.$store.state.user.carToReviewNum = data.carToReviewNum
          this.$store.state.user.routeToReviewNum = data.routeToReviewNum
          this.$store.state.user.reimburseToReviewNum = data.reimburseToReviewNum
          this.$store.state.user.sumToReviewNum = data.userToReviewNum + data.carToReviewNum + data.routeToReviewNum + data.reimburseToReviewNum
          // carToReviewNum: 1
          // userToReviewNum: 0
          // reimburseToReviewNum: 0
          // routeToReviewNum: 0
        }
      })
    }
  }
}
</script>
