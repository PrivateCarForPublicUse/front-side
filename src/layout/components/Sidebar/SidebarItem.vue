<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
          <el-tag v-if="isNest&&item.meta.title === '用户审核'" v-show="this.$store.state.user.userToReviewNum>0" ref="aaa" style="position: absolute;margin:16px 75px;background-color: #f56c6c;color:white" size="mini" @click="click">{{ this.$store.state.user.userToReviewNum }}</el-tag>
          <el-tag v-if="isNest&&item.meta.title === '车辆审核'" v-show="this.$store.state.user.carToReviewNum>0" style="position: absolute;margin:16px 75px;background-color: #f56c6c;color:white" size="mini" @click="click">{{ this.$store.state.user.carToReviewNum }}</el-tag>
          <el-tag v-if="isNest&&item.meta.title === '路程审核'" v-show="this.$store.state.user.routeToReviewNum>0" style="position: absolute;margin:16px 75px;background-color: #f56c6c;color:white" size="mini" @click="click">{{ this.$store.state.user.routeToReviewNum }}</el-tag>
          <el-tag v-if="isNest&&item.meta.title === '报销审核'" v-show="this.$store.state.user.reimburseToReviewNum>0" style="position: absolute;margin:16px 75px;background-color: #f56c6c;color:white" size="mini" @click="click">{{ this.$store.state.user.reimburseToReviewNum }}</el-tag>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
        <el-tag v-if="item.meta.title==='审核管理'" v-show="this.$store.state.user.sumToReviewNum>0" type="danger" style="position: absolute;margin:20px 25px;background-color: #f56c6c;color:white;" size="mini" effect="dark">{{ this.$store.state.user.sumToReviewNum }}</el-tag>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import store from '@/store'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      userToReviewNum: 0,
      userShow: true
    }
  },
  methods: {
    checkNest(isNest, item) {
      if (!isNest) {
        // 非子项
        return false
      }
      if (item.title === '用户审核') {
        let n = this.$store.state.user.num
        console.log('store---' + n)
        return this.$store.state.user.num % 2 === 0
      } else if (item.title === '车辆审核') {
        return true
      } else if (item.title === '路程审核') {
        return true
      } else if (item.title === '报销审核') {
        return true
      }
      return true
    },
    click() {
      // console.log(this.$refs['userAudit'])
      // this.$store.state.user.userToReviewNum++
      console.log('num' + this.$store.state.user.userToReviewNum + typeof (this.$store.state.user.userToReviewNum))
      this.userShow = !this.userShow
      console.log(this.userShow)
      this.userToReviewNum++
      console.log(this.userToReviewNum)
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
