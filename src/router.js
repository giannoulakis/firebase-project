/* eslint-disable no-console */

import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import About from './views/About.vue'
import ProjectList from './views/ProjectList.vue'
import ProjectForm from './views/ProjectForm.vue'
import ProjectView from './views/ProjectView.vue'
import TaskForm from './views/TaskForm.vue'
import TaskView from './views/TaskView.vue'

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
      path: '/about',
      name: 'about',
      component: About
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