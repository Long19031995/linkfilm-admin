<template>
  <div class="select-dropdown">
    <div @click="isShow = true" class="select-dropdown__active">
      <div v-for="(item, index) in active" :key="index" class="item">
        {{ item.name }} <i @click="remove(index)" class="mdi mdi-close"></i>
      </div>
    </div>
    <div v-show="isShow" class="select-dropdown__deactive">
      <div @click="add(index)" v-for="(item, index) in deactive" :key="index" class="item">
        {{ item.name }} <i class="mdi mdi-plus"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectDropdown',

  model: {
    prop: 'active',
    event: 'update'
  },

  props: {
    active: {
      type: Array,
      default: () => []
    },
    all: Array,
  },

  data() {
    return {
      isShow: false
    }
  },

  computed: {
    deactive() {
      return (this.all || []).filter((itemAll) => (this.active || []).findIndex((itemActive) => itemActive.name === itemAll.name) === -1)
    }
  },

  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isShow = false
      }
    })
  },

  methods: {
    remove(index) {
      const active = [...this.active]
      active.splice(index, 1)
      this.$emit('update', active)
    },

    add(index) {
      const active = [...this.active]
      active.push(this.deactive[index])
      this.$emit('update', active)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-dropdown {
  position: relative;
  &__active {
    min-height: 32px;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    background: white;
    .item {
      border: 1px solid #ccc;
      padding: 4px;
      border-radius: 4px;
      margin: 0 4px 4px 0;
      .mdi-close {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  &__deactive {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 0 3px #ccc;
    background: #eee;
    z-index: 1;
    padding: 4px;
    .item {
      border: 1px solid #ccc;
      padding: 4px;
      margin: 0 4px 4px 0;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
        border: 1px solid #eee;
      }
    }
  }
}
</style>