import AddFilm from './components/AddFilm.vue'

import VueRouter from 'vue-router'

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/add-film'
    },
    {
      name: 'add-film',
      path: '/add-film',
      component: AddFilm
    }
  ]
})