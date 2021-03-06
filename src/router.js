/* eslint-disable no-console */

import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Report from './views/Report.vue'
import ProjectList from './views/ProjectList.vue'
import ProjectForm from './views/ProjectForm.vue'
import ProjectView from './views/ProjectView.vue'
import TaskForm from './views/TaskForm.vue'
import TaskView from './views/TaskView.vue'
import MyTasks from './views/MyTasks.vue'

import store from './store'

Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/report',
      name: 'report',
      component: Report
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectList,
    },
    {
      path: '/projects/form/:id?',
      name: 'projectForm',
      component: ProjectForm,
      props:true,
    },
    {
      path: '/projects/view/:id',
      name: 'projectView',
      component: ProjectView,
      props:true,
    },
    {
      path: '/projects/view/:id/new-task',
      name: 'taskNew',
      props: {default:true, popup: true},
      components: {
        default: ProjectView,
        popup: TaskForm,
      },
    },
    {
      path: '/projects/view/:id/update-task/:taskId',
      name: 'taskUpdate',
      props: {default:true, popup: true},
      components: {
        default: ProjectView,
        popup: TaskForm,
      },
    },
    {
      path: '/projects/view/:id/view-task/:taskId',
      name: 'taskView',
      props: {default:true, popup: true},
      components: {
        default: ProjectView,
        popup: TaskView,
      },
    },
    {
      path: '/mytasks',
      name: 'myTasks',
      component: MyTasks,
    },
    {
      path: '/mytasks/view/:id/:taskId',
      name: 'myTaskView',
      props: {default:true, popup: true},
      components: {
        default: MyTasks,
        popup: TaskView,
      },
    },
  ]
})


router.beforeEach((to, from, next) => {
  if(!store.state.isAuthenticated && to.name != 'login' && to.name != 'signup'){
    store.dispatch('setIntendedUrl',{url:to.path});
    next({ name: 'login' })
  } else {
    next();
  }
});

 export default router