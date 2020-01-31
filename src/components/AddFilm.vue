<template>
  <div class="add-film">
    <input-search-film v-model="film.name" @choose="chooseFilm" />
    <div class="poster">
      <img ref="posterImage" :src="film.poster">
      <input ref="posterInput" @change="changeImage('posterImage', $event)" type="file">
    </div>
    <div class="banner">
      <img ref="bannerImage" :src="film.banner">
      <input ref="bannerInput" type="file">
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

    <table>
      <tr>
        <td>Tập phim</td>
        <td><button @click="addChapter()">Thêm tập +</button></td>
        <td><button @click="addFilm()">Thêm | Cập nhật</button></td>
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
            <button @click="addLink(index)">Thêm link +</button>
          </td>
          <td>
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
  </div>
</template>

<script>
import InputDropdown from './InputDropdown'
import InputSearchFilm from './InputSearchFilm'
import InputSearchLink from './InputSearchLink'
import axios from 'axios'

export default {
  name: 'AddFilm',

  components: { InputDropdown, InputSearchFilm, InputSearchLink },

  data() {
    return {
      film: {
        chapters: []
      },
      casts: '',
      directors: '',
      releases: [],
      nations: [],
      genres: [],
      qualities: [],
      webs: []
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
    addFilm() {
      const film = { ...this.film }

      film.casts = this.casts
      film.directors = this.directors

      const poster = this.getImage('posterInput')
      const banner = this.getImage('bannerInput')

      axios.post('http://45.76.145.91:8080/apilink/admin/film/insertOrUpdate', {
        film, poster, banner
      })
    },

    getImage(type) {
      const files = this.$refs[type].files

      if (files[0]) {
        const formData = new FormData()
        formData.append('files[]', files[0])

        return formData
      }

      return this.film[type.replace('Input', 'Image')]
    },

    changeImage(type, $event) {
      const files = $event.target.files

      if (files[0]) {
        var reader = new FileReader()

        reader.onload = (e) => {
          const ref = this.$refs[type]
          ref.setAttribute('src', e.target.result)
        }

        reader.readAsDataURL(files[0])
      }
    },

    addChapter() {
      const chapters = this.film.chapters || []
      chapters.unshift({
        name: '',
        duration: '',
        links: [
          {
            source: '',
            qualities: [],
            web: []
          }
        ]
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
    },

    chooseLink(link, event) {
      link.source = event.source
      link.qualities = event.qualities
      link.webs = event.webs
    },

    async getReleases() {
      const { data } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=3')
      this.releases = data.data.topics
    },

    async getNations() {
      const { data } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=6')
      this.nations = data.data.topics
    },

    async getGenres() {
      const { data } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=7')
      this.genres = data.data.topics
    },

    async getQualities() {
      const { data } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=5')
      this.qualities = data.data.topics
    },

    async getWebs() {
      const { data } = await axios.get('http://45.76.145.91:8080/apilink/admin/topic/list?type=8')
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
</style>