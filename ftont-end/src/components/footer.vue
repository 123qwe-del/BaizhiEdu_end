<template>
  <div class="footer">
    <ul>
      <li v-for="(foot,index) in data_list" :key="index">
        <a :href="foot.link" style="color: #d3dce6"><span>{{foot.title}}</span></a>

      </li>
    </ul>
  </div>
</template>
<!--<script type="text/javascript" src="../static/live2dw/live2dw/lib/L2Dwidget.0.min.js"></script>-->
<script>
export default {
  name: "footer",
  data(){
    return {
      data_list:[],

    }
  },
  methods:{
    get_footer(){
      this.$axios({
        url:'http://127.0.0.1:8000/api/foot/',
        method:'get',
      }).then(response =>{
        this.data_list = response.data
      }).catch(errors =>{
        console.log(errors)
      })
    },

  },
  created() {
    this.get_footer()

  }
}
</script>

<style scoped>
.footer {
  width: 100%;
  height: 128px;
  background: #faaccd;
  color: #fff;
}

.footer ul {
  margin: 0 auto 16px;
  padding-top: 38px;
  width: 810px;
}

.footer ul li {
  float: left;
  width: 112px;
  margin: 0 10px;
  text-align: center;
  font-size: 14px;
}

.footer ul::after {
  content: "";
  display: block;
  clear: both;
}

.footer p {
  text-align: center;
  font-size: 12px;
}
</style>