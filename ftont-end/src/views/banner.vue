<template>
  <div id="app">
    <el-carousel height="1000px" :interval="3000" arrow="always">
      <el-carousel-item v-for="(banner, index) in banner_list" :key="index">
        <a :href="banner.link">
          <img :src="banner.img" alt="图片加载失败" height="1000px">
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "banner",
  data() {
    return {
      banner_list: [],
    }
  },

  methods: {
    banner_show() {
      this.$axios({
        url: 'http://127.0.0.1:8000/api/banner/',
        method: 'get',
      }).then(response => {
        this.banner_list = response.data
        console.log(this.banner_list, 24)
      }).catch(errors => {
        console.log(errors, 26)
      })
    },

  },
  created() {
    this.banner_show()
  }
}
</script>

<style scoped>
#app{
  position:relative;
  margin-top: 5px
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: tan;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: tan;
}
</style>