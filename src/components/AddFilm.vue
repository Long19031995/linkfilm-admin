<template>
<div class="add-film">
    <input-search-film v-model="film.name" @choose="chooseFilm" />
    <div class="poster">
        <img ref="posterImage" :src="film.poster">
        <input ref="posterInput" @change="changeImage('poster', $event)" type="file">
    </div>
    <div class="banner">
        <img ref="bannerImage" :src="film.banner">
        <input ref="bannerInput" @change="changeImage('banner', $event)" type="file">
    </div>
    <table>
        <tr>
            <td>Tên</td>
            <td><input v-model="film.name" type="text"></td>
        </tr>
        <tr>
            <td>Tên tiếng anh</td>
            <td><input v-model="film.nameEnglish" type="text"></td>
        </tr>
        <tr>
            <td>Mô tả</td>
            <td><textarea v-model="film.description" style="height: 200px" /></td>
      </tr>
      <tr>
        <td>Diễn viên</td>
        <td><input v-model="casts" type="text"></td>
      </tr>
      <tr>
        <td>Đạo diễn</td>
        <td><input v-model="directors" type="text"></td>
      </tr>
      <tr>
        <td>Tags</td>
        <td><input v-model="tags" type="text"></td>
      </tr>
      <tr>
        <td>Năm phát hành</td>
        <td><input-dropdown v-model="film.releases" :all="releases"/></td>
      </tr>
      <tr>
        <td>Quốc gia</td>
        <td><input-dropdown v-model="film.nations" :all="nations"/></td>
      </tr>
      <tr>
        <td>Thể loại</td>
        <td><input-dropdown v-model="film.genres" :all="genres"/></td>
      </tr>
      <tr>
        <td>Tổng số tập</td>
        <td><input v-model="film.chapterTotal" type="text"></td>
      </tr>
    </table>
    <br/>
    <br/>
    <table>
      <tr>
        <td>Tập phim</td>
        <td><button @click="addChapter()">Thêm tập +</button></td>
      </tr>
    </table>
    <table class="table">
      <template v-for="(chapter, index) in film.chapters">
        <tr :key="index">
          <td>
            <p>Tên tập</p>
            <input v-model="chapter.name" type="text">
          </td>
          <td>
            <p>Thời gian</p>
            <input v-model="chapter.duration" type="text">
          </td>
          <td>
            <br/>
            <button @click="addLink(index)">Thêm link +</button>
          </td>
          <td>
            <br/>
            <button @click="deleteChapter(index)">Xóa tập -</button>
          </td>
        </tr>
        <tr v-for="(link, index) in chapter.links" :key="index" class="table-link">
          <td>
            <p>Link</p>
            <input-search-link v-model="link.name" @choose="chooseLink(link, $event)" />
          </td>
          <td>
            <p>Source</p>
            <input v-model="link.source" type="text">
          </td>
          <td>
            <p>Chất lượng</p>
            <input-dropdown v-model="link.qualities" :all="qualities" />
          </td>
          <td>
            <p>Web</p>
            <input-dropdown v-model="link.webs" :all="webs" />
          </td>
          <td @click="deleteLink(chapter, index)">
            <i class="mdi mdi-delete"></i>
          </td>
        </tr>
        <tr :key="index">
          <td class="table-header"></td>
        </tr>
      </template>
    </table>
    <br/>
    <br/>
    <br/>
    <br/>
    <button @click="addFilm()" class="update-film">
        <template v-if="loading">
            ...
        </template>
        <template v-else>
            Thêm | Cập nhật
        </template>
    </button>
  </div>
</template>

<script>
import InputDropdown from './InputDropdown'
import InputSearchFilm from './InputSearchFilm'
import InputSearchLink from './InputSearchLink'
import axios from 'axios'

export default {
    name: 'AddFilm',

    components: {
        InputDropdown,
        InputSearchFilm,
        InputSearchLink
    },

    data() {
        return {
            film: {
                chapters: [],
                banner: '',
                poster: ''
            },
            casts: [],
            directors: [],
            tags: [],
            releases: [],
            nations: [],
            genres: [],
            qualities: [],
            webs: [],
            loading: false,
        }
    },

    mounted() {
        this.getReleases()
        this.getNations()
        this.getGenres()
        this.getQualities()
        this.getWebs()
    },

    methods: {
        async addFilm() {
            this.loading = true

            const film = {
                ...this.film
            }
            const formData = new FormData()

            film.casts = this.convertStringToListTopic(this.casts, 1)
            film.directors = this.convertStringToListTopic(this.directors, 2)

            film.tags = this.convertStringToListTopic(this.tags, 4)

            const poster = this.$refs.posterInput.files[0] || this.film.poster
            const banner = this.$refs.bannerInput.files[0] || this.film.banner

            formData.append('film', JSON.stringify(film))
            formData.append('poster', poster)
            formData.append('banner', banner)

            await axios.post('http://45.76.145.91:8080/apilink/admin/film/insertOrUpdate', formData)

            this.loading = false
        },

        /**
         * chuyển đổi từ string sang topic
         * các name topic cách nhau bằng dấu phẩy trong text
         * phục vụ cho diễn viên và đạo diễn
         *
         * @text đây là dữ liệu cần tách để tạo ra các topic
         * @typeTopic type của topic, type có thể có các giá trị sau:
         *    SYSTEM(0, "Hệ thống"),
         *    CAST(1, "Diễn viên"),
         *    DIRECTOR(2, "Đạo diễn"),
         *    RELEASE(3, "Năm phát hành"),
         *    TAG(4, "Tags"),
         *    QUALITY(5, "Chất lượng phim"),
         *    NATION(6, "Quốc gia"),
         *    GENRE(7, "Thể loại phim"),
         *    WEB(8, "Web phim")
         */
        convertStringToListTopic(text, typeTopic) {
            if (!text.length) return
            const listStr = text.split(", ") // lấy tên của các topic
            const listTopic = Array(listStr.length)

            for (let i = 0; i < listStr.length; i += 1) {
                const topic = { // khởi tạo topic
                    name: '',
                    type: typeTopic
                }
                topic.name = listStr[i]
                listTopic[i] = topic
            }

            return listTopic
        },

        changeImage(type, $event) {
            const files = $event.target.files

            if (files[0]) {
                var reader = new FileReader()

                reader.onload = (e) => {
                    this.film[type] = "" //chỗ này tao xử lý hơi ngu, nhưng nó lại hoạt động, có gì sửa giúp tao
                    this.film[type] = e.target.result
                }

                reader.readAsDataURL(files[0])
            }
        },

        addChapter() {
            const chapters = this.film.chapters || []
            chapters.unshift({
                name: '',
                duration: '',
                links: [{
                    source: '',
                    qualities: [],
                    web: []
                }]
            })

            this.film.chapters = []

            this.$nextTick(() => {
                this.film.chapters = chapters
            })
        },

        deleteChapter(index) {
            const chapters = this.film.chapters || []

            chapters.splice(index, 1)

            this.$set(this.film.chapters, chapters)
        },

        addLink(index) {
            const links = this.film.chapters[index].links || []

            links.unshift({
                source: '',
                qualities: [],
                web: []
            })

            this.film.chapters[index].links = []

            this.$nextTick(() => {
                this.film.chapters[index].links = links
            })
        },

        deleteLink(chapter, index) {
            const links = chapter.links || []

            links.splice(index, 1)

            this.$set(chapter.links, links)
        },

        chooseFilm(film) {
            this.film = film

            this.casts = (this.film.casts || []).map((cast) => cast.name).join(', ')
            this.directors = (this.film.directors || []).map((director) => director.name).join(', ')

            this.tags = (this.film.tags || []).map((tag) => tag.name).join(', ')
        },

        chooseLink(link, event) {
            link.source = event.source
            link.qualities = event.qualities
            link.webs = event.webs
        },

        async getReleases() {
            const {
                data
            } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=3')
            this.releases = data.data.topics
        },

        async getNations() {
            const {
                data
            } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=6')
            this.nations = data.data.topics
        },

        async getGenres() {
            const {
                data
            } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=7')
            this.genres = data.data.topics
        },

        async getQualities() {
            const {
                data
            } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=5')
            this.qualities = data.data.topics
        },

        async getWebs() {
            const {
                data
            } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=8')
            this.webs = data.data.topics
        }
    }
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
}

.poster {
    margin-top: 12px;
    width: 100%;
    height: 300px;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
    }
}

.banner {
    margin: auto;
    width: 200px;
    height: 200px;
    margin-top: -100px;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
    }
}

.table {
    padding: 8px;
    border: 1px solid #ccc;
}

.table-header {
    padding: 16px;
}

.table-link {
    background: #eee;
    border-collapse: collapse;
    border-spacing: 0;

    td {
        padding: 8px;
    }
}

.add-film {
    width: 70%;
    margin: auto;
}

button {
    border: none;
    outline: none;
    padding: 8px 16px;

    &:hover {
        cursor: pointer;
        opacity: 0.7;
    }
}

table {
    width: 90%;
}

input,
textarea {
    width: 100%;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ccc;
    outline: none;
    padding: 0 8px;
}

textarea {
    height: 64px;
    padding: 8px;
}

.update-film {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: green;
    color: white;
    width: 100%;
    height: 56px;
}
</style>
