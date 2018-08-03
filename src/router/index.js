import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'
import index from '@/components/index'
import setting from '@/components/setting'
import ApplyOrganization from '@/components/ApplyOrganization'
import PersonInfo from "@/components/PersonInfo"
import MessageBox from "@/components/shortMessageContainer/MessageBox.vue"
// const PersonInfo = r => require.ensure([], () => r(require('../components/PersonInfo')), 'PersonInfo');
const logout = r => require.ensure([], () => r(require('../components/logout')), 'logout');

// const Component404 = require.ensure([], () => r(require('../components/404')), 'page404');
import test from "@/components/test"
import Organization from "@/components/Organization"
import index2 from "@/components/index2"
import index3 from "@/components/index3"
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/MessageBox',
      name: 'MessageBox',
      component: MessageBox
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'ttttt',
      component: login
    },
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/ApplyOrganization',
      name: 'ApplyOrganization',
      component: ApplyOrganization
    },
    {
      path: '/setting',
      name: '/setting',
      component: setting
    },
    {
      path: '/logout',
      name: '/logout',
      component: logout
    },
    {
      path: "*",
      redirect: "/"
    },
    {
      path: '/test',
      name: 'test',
      component: test,
    },
    {
      path:'/user/:id',
      name: 'person-info',
      component: PersonInfo
    },
    {
      path: '/organization/:id',
      name: 'organization',
      component: Organization
    },
    {
      path: '/xbb',
      name: 'xbb',
      component: index2
    },
    {
      path: '/bbq',
      name: 'bbq',
      component: index3
    }
  ]
})
