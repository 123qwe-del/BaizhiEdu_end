<template>
  <div class="header-box">
    <div class="header">
      <div class="content">
        <div class="logo full-left">
          <router-link to="/"><img src="../static/image/logo.png" alt="" height="60px"></router-link>
        </div>
        <ul class="nav full-left">
<!--          遍历数据-->
          <li v-for="(header_nav,index) in data_list" :key="index">
<!--            判断是否是内部链接，如果是使用router-link-->
            <router-link :to="header_nav.link" style="font-size: 20px" v-if="header_nav.is_site===true">
              {{header_nav.title}}
            </router-link>
<!--            如果不是内部链接就使用 a标签-->
            <a :href="header_nav.link" v-else  style="font-size: 20px">{{header_nav.title}}</a>
          </li>
        </ul>
        <div class="login-bar full-right">
          <div class="shop-cart full-left">
            <img src="/static/image/cart.svg" alt="">
            <span><router-link to="/cart">{{this.$store.state.course_len}}购物车</router-link></span>
          </div>
          <div class="login-box full-left" v-if="show">
            <router-link to="/login">登录</router-link>
            &nbsp;|&nbsp;
            <router-link to="/register">注册</router-link>
          </div>
          <div class="login-box full-left" v-else>
            <router-link to="/login"><span style="color: mediumvioletred">{{username}}</span></router-link>
            &nbsp;|&nbsp;
            <span @click="logout">注销</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hander",
  data(){
    return {
      data_list:[],
      username:'',
      show:true
    }
  },
  methods:{
    get_header(){
      this.$axios({   //发送ajax请求
        url:'http://127.0.0.1:8000/api/hdr/',  //设置路径
        method:'get',  //设置发送方式
      }).then(response =>{ //如果成功
        this.data_list = response.data  //把数据赋值给data_list
        console.log(response.data)
        this.show =! this.show
      }).catch(error =>{  //如果失败
        console.log(error)
      })
    },
    name(){
      let user = localStorage.getItem('username')
      if (user){
        this.username=user
      }else{
        this.show=false
      }
    },
    logout(){
      localStorage.clear()
      this.$message({
        'message':'感谢您在本站花费了宝贵的时间，欢迎下次光临',
        'type':'success',
        'duration':3000
      })
      this.show=true
    },
  },
  created() {
    this.get_header()
    this.name()
  }
}
</script>

<style scoped>
.header-box {
  height: 80px;
}

.header {
  width: 100%;
  height: 80px;
  box-shadow: 0 0.5px 0.5px 0 #c9c9c9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 99;
  background: #faaccd;
}

.header .content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.header .content .logo {
  height: 80px;
  line-height: 80px;
  margin-right: 50px;
  cursor: pointer; /* 璁剧疆鍏夋爣鐨勫舰鐘朵负鐖瓙 */
}

.header .content .logo img {
  vertical-align: middle;
}

.header .nav li {
  float: left;
  height: 80px;
  line-height: 80px;
  margin-right: 30px;
  font-size: 16px;
  color: #4a4a4a;
  cursor: pointer;
}

.header .nav li span {
  padding-bottom: 16px;
  padding-left: 5px;
  padding-right: 5px;
}

.header .nav li span a {
  display: inline-block;
}

.header .nav li .this {
  color: #4a4a4a;
  border-bottom: 4px solid #ffc210;
}

.header .nav li:hover span {
  color: #000;
}

.header .login-bar {
  height: 80px;
}

.header .login-bar .shop-cart {
  margin-right: 20px;
  border-radius: 17px;
  background: #f7f7f7;
  cursor: pointer;
  font-size: 14px;
  height: 28px;
  width: 100px;
  margin-top: 30px;
  line-height: 32px;
  text-align: center;
}

.header .login-bar .shop-cart:hover {
  background: #f0f0f0;
}

.header .login-bar .shop-cart img {
  width: 15px;
  margin-right: 4px;
  margin-left: 6px;
}

.header .login-bar .shop-cart span {
  margin-right: 6px;
}

.header .login-bar .login-box {
  margin-top: 33px;
}

.header .login-bar .login-box span {
  color: #4a4a4a;
  cursor: pointer;
}

.header .login-bar .login-box span:hover {
  color: #000000;
}

a {
  text-decoration: none;
  color: #333;
}

.member {
  display: inline-block;
  height: 34px;
  margin-left: 20px;
}

.member img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-block;
}

.member img:hover {
  border: 1px solid yellow;
}

.header .login-bar .login-box1 {
  margin-top: 16px;
}

a:hover {
  display: inline-block;
}
</style>