<template>
  <div class="list-film px64 vh100 overflow-auto">
    <div class="flex justify-space-between mb32">
      <div class="flex">
        <div @click="clickHD" class="hd px24 py8 cl-white hover-pointer m8" :class="{ 'bg-r200': hd, 'bg-n200': !hd }">
          hd
        </div>
        <div @click="clickCAM" class="cam px24 py8 cl-white hover-pointer m8" :class="{ 'bg-r200': cam, 'bg-n200': !cam }">
          cam
        </div>
      </div>
      <router-link :to="{ name: 'add-film' }">
        <button class="p8 m8 hover-pointer bd-none">Thêm phim</button>
      </router-link>
    </div>

    <router-link v-for="(film, index) in listFilm" class="film flex overflow-hidden text-decoration-none mb32" :key="index" :to="{ name: 'add-film', query: { id: film.id } }">
      <div class="col-3">
        <img :src="film.poster">
      </div>
      <div class="col-9 pl32">
        <div class="text-uppercase font-bold font-18px mb8">
          {{ film.name }}
        </div>
        <div>
          {{ film.description }}
        </div>
      </div>
    </router-link>

    <div class="flex justify-center mb64">
      <button v-if="skip > 0" @click="prev" class="hover-pointer p8 m8">Trước</button>
      <button v-if="listFilm.length === 6" @click="next" class="hover-pointer p8 m8">Sau</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { buildQueryString } from '../utils'

export default {
  name: 'ListFilm',

  data() {
    return {
      listFilm: [],
      hd: false,
      cam: false,
      skip: 0,
      limit: 20,
    }
  },

  computed: {
    filter() {
      const result = []

      if (this.hd) {
        result.push('hd')
      }

      if (this.cam) {
        result.push('cam')
      }

      return result.join(',')
    },
    query() {
      return {
        filter: this.filter,
        skip: this.skip,
        limit: this.limit
      }
    }
  },

  async mounted() {
    await this.getListFilm()
  },

  methods: {
    async clickHD() {
      this.hd = !this.hd
      await this.getListFilm()
    },

    async clickCAM() {
      this.cam = !this.cam
      await this.getListFilm()
    },

    async getListFilm() {
      const response = await axios.get(`http://45.76.145.91:8080/apilink/admin/film/filter?${buildQueryString(this.query)}`)
      this.listFilm = response.data.data.films
    },

    async prev() {
      this.skip--
      await this.getListFilm()
    },

    async next() {
      this.skip++
      await this.getListFilm()
    }
  }
}
</script>

<style lang="scss" scoped>
.list-film {
  .film {
    max-height: 143px;
  }
}
</style>