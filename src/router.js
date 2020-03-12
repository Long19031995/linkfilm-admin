import AddFilm from './components/AddFilm.vue'
import ListFilm from './components/ListFilm.vue'

import VueRouter from 'vue-router'

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/list-film'
    },
    {
      name: 'add-film',
      path: '/add-film',
      component: AddFilm
    },
    {
      name: 'list-film',
      path: '/list-film',
      component: ListFilm
    }
  ]
})