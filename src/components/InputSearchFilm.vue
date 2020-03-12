<template>
<div @click="isShow = true" class="input-search">
    <input @input="search" v-model="key" type="text" placeholder="Search film">
    <div ref="result" v-show="isShow" class="result">
        <div @click="choose(film)" class="item" v-for="(film, index) in films" :key="index">
            <img :src="film.poster">
            {{ film.name }}
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'InputSearch',

    data() {
        return {
            key: '',
            films: [],
            isShow: false
        }
    },

    mounted() {
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target) || this.$refs.result.contains(e.target)) {
                this.isShow = false
            }
        })
    },

    methods: {
        async search() {
            const {
                data
            } = await axios.get(`http://45.76.145.91:8080/apilink/admin/film/search?q=${this.key}`)
            this.films = data.data.films
        },

        choose(film) {
            this.$emit('choose', film)
        }
    }
}
</script>

<style lang="scss">
.input-search {
    width: 100%;
    position: relative;

    .result {
        position: absolute;
        width: 100%;
        top: calc(100% + 1px);
        left: 0;
        background: white;
        box-shadow: 0 0 3px #ccc;
        border-radius: 4px;
        overflow: hidden;
        z-index: 2;

        .item {
            padding: 8px;
            border-bottom: 1px solid #ccc;

            img {
                height: 80px;
                width: auto;
            }

            &:last-child {
                border-bottom: none;
            }
        }
    }
}
</style>
