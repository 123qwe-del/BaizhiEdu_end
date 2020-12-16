<template>
  <div class="detail">
    <Header></Header>
    <div class="main">
      <div class="course-info">
        <div class="wrap-left">
          <videoPlayer class="video-player vjs-custom-skin"
                       ref="videoPlayer"
                       :playsinline="true"
                       :options="playerOptions"
                       @play="onPlayerPlay($event)"
                       @pause="onPlayerPause($event)">
          </videoPlayer>
          <!--    @play="onPlayerPlay($event)视频播放前插入的东西
                  @pause="onPlayerPause($event)   播放后插入的东西-->
        </div>
        <div class="wrap-right">
          <h1 class="course-name">{{ show_list.name }}</h1>
          <p class="data">{{ show_list.students }}人在学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>课程总时长：{{
              show_list.lessons
            }}课时/89小时</span>&nbsp;&nbsp;&nbsp;&nbsp;
            难度：<span v-if="show_list.level===0">入门</span>
            <span v-else-if="show_list.level===1">进阶</span>
            <span v-else-if="show_list.level===2">大师</span>
          </p>
          <div v-if="show_list.discount_price">
            <div class="sale-time">
              <p class="sale-type">{{ show_list.discount_name }}</p>
              <p class="expire">距离结束：仅剩 {{ parseInt((show_list.active_time)/(24 * 3600)) }}天
                {{parseInt(show_list.active_time/3600 % 24)}}小时 {{ parseInt(show_list.active_time/60%60) }}分 <span
                  class="second">{{ parseInt(show_list.active_time%60) }}</span> 秒</p>
            </div>
            <p class="course-price">
              <span>活动价</span>
              <span class="discount">¥{{ parseInt(show_list.discount_price) }} </span>
              <span class="original">原价：{{ show_list.price }}元</span>
            </p>
          </div>
          <div v-else>
            <div class="sale-time">
              <p></p>
              <p></p>
            </div>
            <p class="course-price">
              <span>价格</span>
              <span class="discount">¥{{ parseInt(show_list.price) }}元 </span>
            </p>
          </div>
          <div class="buy">
            <div class="buy-btn">
              <button class="buy-now">立即购买</button>
              <button class="free">免费试学</button>
            </div>
            <div class="add-cart" @click="shopping"><img src="../static/image/购物车.jpg" alt="" height="50px"
                                                         width="50px">加入购物车
            </div>
          </div>
        </div>
      </div>
      <div class="course-tab">
        <ul class="tab-list">
          <li :class="tabIndex===1?'active':''" @click="tabIndex=1">详情介绍</li>
          <li :class="tabIndex===2?'active':''" @click="tabIndex=2">课程章节 <span
              :class="tabIndex!=2?'free':''">(试学)</span>
          </li>
          <li :class="tabIndex===3?'active':''" @click="tabIndex=3">学生评论 ({{ comment_show.length }})</li>
          <li :class="tabIndex===4?'active':''" @click="tabIndex=4">常见问题</li>
        </ul>
      </div>
      <div class="course-content">
        <div class="course-tab-list">
          <div class="tab-item" v-if="tabIndex===1">
            <div v-html="show_list.brief_url"></div>
          </div>
          <div class="tab-item" v-if="tabIndex===2" style="overflow:auto" id="qqq">
            <div class="tab-item-title">
              <p class="chapter">课程章节</p>
              <p class="chapter-length">共{{ captch }}章 {{ show_list.lessons }}个课时</p>
            </div>
            <div class="chapter-item" v-for="(show_chapter,index) in show_list.Chapter_list" :key="index">
              <p class="chapter-title"><img src="../static/image/12.png" alt="">第{{ index + 1 }}章 |
                {{ show_chapter.name }}</p>
              <ul class="lesson-list" v-for="(show_lessons,index) in show_list.lessons_list" :key="index">
                <li class="lesson-item" v-if="show_lessons.chapter_id===show_chapter.id">
                  <p class="name"><span class="index">{{ show_chapter.id }}-{{ 1 }}</span> {{ show_lessons.name }}<span
                      class="free">免费</span>
                  </p>
                  <p class="time">07:30 <img src="../static/image/7789.jpg"></p>
                  <button class="try">立即试学</button>
                </li>
              </ul>
            </div>
          </div>
          <div class="tab-item" v-if="tabIndex===3">
            <!--            <div style="font-size: 18px">{{ name }}</div>-->
            <div>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>评论数据</span>
                  <el-button type="text" @click="dialog = true" style="float: right">说点什么吧</el-button>
                </div>
                <div>
                  <el-drawer
                      title="说说你的想法"
                      :before-close="handleClose"
                      :visible.sync="dialog"
                      direction="ltr"
                      custom-class="demo-drawer"
                      ref="drawer"
                  >
                    <div class="demo-drawer__content">
                      <el-form :model="form">
                        <el-form-item label="内容" :label-width="formLabelWidth">
                          <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-form>
                      <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取 消</el-button>
                        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">
                          {{ loading ? '提交中 ...' : '确 定' }}
                        </el-button>
                      </div>
                    </div>
                  </el-drawer>
                </div>
                <div v-for="(comments,index) in comment_show" :key="index" class="text item">
                  <div>
                    <div>来自用户：<span style="color: peru">{{ comments.name }}</span>的评论</div>
                    <br>
                    <p>{{ comments.content }}</p><br>
                    <div style="float: right"><p>{{ comments.time }}</p></div>
                    <!--                    <HR align=center width=300 color=#987cb9 SIZE=1>-->
                    <hr align="center" style="width:880px;color: #987cb9;size: 1px">
                  </div>
                  <br>

                </div>
              </el-card>
            </div>
          </div>

          <div class="tab-item" v-if="tabIndex===4">
            常见问题
          </div>
        </div>
        <div class="course-side">
          <div class="teacher-info">
            <h4 class="side-title"><span>授课老师</span></h4>
            <div class="teacher-content">
              <div class="cont1">
                <img
                    :src="show_list.teacher.image"
                    width="5px">
                <p class="teacher-name">职称：{{ show_list.teacher.name }}</p>
                <p class="teacher-name">签名：{{ show_list.teacher.signature }}</p><br>
                <p class="teacher-title">{{ show_list.teacher.title }}</p>
                <div class="name">

                </div>
              </div>
              <p class="narrative">技术专家，百知教育金牌讲师，独有的闷骚气质撩到爆炸</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>


<script>
import Footer from "@/components/footer";
import Header from "@/components/headeer";
//视频播放组件
import {videoPlayer} from 'vue-video-player'

export default {
  name: "detial",
  data() {
    return {
//评论按钮所需*******************************
      //按钮---------------------------
      formLabelWidth: '80px',
      table: false,
      dialog: false,
      loading: false,
      //------------------------------
      form: {
        name: '',
      },
      comment_show: [],
//****************************************
      name: localStorage.getItem("username"),
      textarea: '',
      course_id: 0,
      tabIndex: 3, // 当前选项卡显示的下标
      id: null,
      show_list: {
        teacher: {}//防止报错
      },
      is_show: false,
      captch: "",
      //视频配置*****
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, //如果true,则自动播放
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 循环播放
        preload: 'auto',  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ // 播放资源和资源格式
          type: "video/mp4",
          src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          //你的视频地址（必填）
        }],
        poster: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2386928961,1703210503&fm=26&gp=0.jpg", //视频封面图
        width: document.documentElement.clientWidth, // 默认视频全屏时的最大宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //************
      }
    }
  },
  created() {
    // 获取活动剩余时间*---------------------------------------------
    this.id = this.$route.query.id
    console.log(this.id)
    this.$axios({
      url: `http://127.0.0.1:8000/apiv3/detail/${this.id}`,
      method: 'get',
    }).then(res => {
      console.log(res.data, 136)
      this.show_list = res.data
      this.captch = res.data.Chapter_list.length
      console.log(this.captch, 120)
      console.log(this.show_list)
      if (this.show_list.active_time>0){
        let time = setInterval(()=>{
          console.log(time)
          if (this.show_list.active_time>1){
            this.show_list.active_time-=1
          }else {
            clearInterval(timer)
          }
        },1000)
      }
    }).catch(error => {
      console.log(error)
    })
    //-------------------------------------------------------------------

    // 调用评论区显示函数
    this.commentss()
  },
  components: {
    Footer: Footer,
    Header: Header,
    videoPlayer
  },
  methods: {
    handleClose(done) {
      if (this.loading) {
        return;
      }
      //评论区是否提交
      this.$confirm('确定要提交表单吗？')
          .then(() => {
            this.loading = true;
            this.timer = setTimeout(() => {
              done();
              // 动画关闭需要一定的时间
              setTimeout(() => {
                this.loading = false;
              }, 400);
            }, 2000);

          })
          .catch(() => {
          });
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv4/createcomment/',
        method: 'post',
        data: {
          name: this.name,
          content: this.form.name,
        }
      }).then(res => {
        console.log(res.status)
        this.commentss()
      }).catch(error => {
        console.log(error)
      })
    },
    //是否显示评论输入框
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    //评论区显示
    commentss() {
      // this.id = this.$route.query.id
      this.$axios({
        url: "http://127.0.0.1:8000/apiv4/comment/",
        method: 'get',
      }).then(res => {
        this.comment_show = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    //校验是否已经登陆
    is_login() {
      let token = localStorage.getItem("token")
      if (!token) {
        let self = this;
        this.$confirm("登陆后查看", "用户未登陆", {
          callback() {
            self.$router.push("/login")
          }
        })
        return false
      }
      {
        return token
      }
    },
    //进入购物车按钮
    shopping() {
      let token = this.is_login()
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv5/cart/',
        method: 'post',
        data: {
          course_id: this.$route.query.id
        },
        headers: {
          "Authorization": "jwt " + token
        }
      }).then(res => {
        console.log(res.data)
        this.$message.success({
          "message": '添加成功',
          type: 'success',
          'duration': 2000
        })
        this.$store.commit("add_cart", res.data.course_len)
      }).catch(error => {
        console.log(error)
      })
    },
  }
}
</script>

<style scoped>
.block {
  width: 80px;
  float: left;
}

.me {
  float: right;
  font-size: 12px;
  border-top: 0;
  margin: 0;
}

#qqq {
  width: 880px;
  height: 350px;
  background: #fff;
  padding-bottom: 20px;
  box-shadow: 0 2px 4px 0 #f0f0f0;
}

.main {
  background: #fff;
  padding-top: 30px;
  width: 100%;
}

.course-info {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.wrap-left {
  float: left;
  width: 690px;
  height: 388px;
  background-color: #000;
}

.wrap-right {
  float: left;
  position: relative;
  height: 388px;
}

.course-name {
  font-size: 33px;
  color: #333;
  padding: 10px 23px;
  letter-spacing: .45px;
}

.data {
  padding-left: 23px;
  padding-right: 23px;
  padding-bottom: 16px;
  font-size: 14px;
  color: #9b9b9b;
}

.sale-time {
  width: 464px;
  background: #84cc39;
  font-size: 14px;
  color: #4a4a4a;
  padding: 10px 23px;
  overflow: hidden;
}

.sale-type {
  font-size: 16px;
  color: #fff;
  letter-spacing: .36px;
  float: left;
}

.sale-time .expire {
  font-size: 14px;
  color: #fff;
  float: right;
}

.sale-time .expire .second {
  width: 24px;
  display: inline-block;
  background: #fafafa;
  color: #5e5e5e;
  padding: 6px 0;
  text-align: center;
}

.course-price {
  background: #fff;
  font-size: 14px;
  color: #4a4a4a;
  padding: 5px 23px;
}

.discount {
  font-size: 26px;
  color: #fa6240;
  margin-left: 10px;
  display: inline-block;
  margin-bottom: -5px;
}

.original {
  font-size: 14px;
  color: #9b9b9b;
  margin-left: 10px;
  text-decoration: line-through;
}

.buy {
  width: 464px;
  padding: 0px 23px;
  position: absolute;
  left: 0;
  bottom: 20px;
  overflow: hidden;
}

.buy .buy-btn {
  float: left;
}

.buy .buy-now {
  width: 125px;
  height: 40px;
  border: 0;
  background: #ffc210;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  margin-right: 15px;
  outline: none;
}

.buy .free {
  width: 125px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 15px;
  background: #fff;
  color: #ffc210;
  border: 1px solid #ffc210;
}

.add-cart {
  float: right;
  font-size: 20px;
  color: #ffc210;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
}

.add-cart img {
  width: 30px;
  height: 30px;
  margin-right: 7px;
  vertical-align: middle;
}

.course-tab {
  width: 100%;
  background: #fff;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px 0 #f0f0f0;

}

.course-tab .tab-list {
  width: 1200px;
  margin: auto;
  color: #4a4a4a;
  overflow: hidden;
}

.tab-list li {
  float: left;
  margin-right: 15px;
  padding: 26px 20px 16px;
  font-size: 17px;
  cursor: pointer;
}

.tab-list .active {
  color: #ffc210;
  border-bottom: 2px solid #ffc210;
}

.tab-list .free {
  color: #fb7c55;
}

.course-content {
  width: 1200px;
  margin: 0 auto;
  background: #FAFAFA;
  overflow: hidden;
  padding-bottom: 40px;
}

.course-tab-list {
  width: 880px;
  height: auto;
  padding: 20px;
  background: #fff;
  float: left;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 4px 0 #f0f0f0;
}

/*.tab-item {*/
/*  width: 880px;*/
/*  height: 500px;*/
/*  background: #fff;*/
/*  padding-bottom: 20px;*/
/*  box-shadow: 0 2px 4px 0 #f0f0f0;*/
/*}*/

.tab-item-title {
  /*height: 1000px;*/
  justify-content: space-between;
  padding: 25px 20px 11px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  border-bottom-color: rgba(51, 51, 51, .05);
  overflow: hidden;
}

.chapter {
  font-size: 17px;
  color: #4a4a4a;
  float: left;
}

.chapter-length {
  float: right;
  font-size: 14px;
  color: #9b9b9b;
  letter-spacing: .19px;
}

.chapter-title {
  font-size: 16px;
  color: #4a4a4a;
  letter-spacing: .26px;
  padding: 12px;
  background: #eee;
  border-radius: 2px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.chapter-title img {
  width: 18px;
  height: 18px;
  margin-right: 7px;
  vertical-align: middle;
}

.lesson-list {
  padding: 0 20px;
}

.lesson-list .lesson-item {
  padding: 15px 20px 15px 36px;
  cursor: pointer;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.lesson-item .name {
  font-size: 14px;
  color: #666;
  float: left;
}

.lesson-item .index {
  margin-right: 5px;
}

.lesson-item .free {
  font-size: 12px;
  color: #fff;
  letter-spacing: .19px;
  background: #ffc210;
  border-radius: 100px;
  padding: 1px 9px;
  margin-left: 10px;
}

.lesson-item .time {
  font-size: 14px;
  color: #666;
  letter-spacing: .23px;
  opacity: 1;
  transition: all .15s ease-in-out;
  float: right;
}

.lesson-item .time img {
  width: 18px;
  height: 18px;
  margin-left: 15px;
  vertical-align: text-bottom;
}

.lesson-item .try {
  width: 86px;
  height: 28px;
  background: #ffc210;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  position: absolute;
  right: 20px;
  top: 10px;
  opacity: 0;
  transition: all .2s ease-in-out;
  cursor: pointer;
  outline: none;
  border: none;
}

.lesson-item:hover {
  background: #fcf7ef;
  box-shadow: 0 0 0 0 #f3f3f3;
}

.lesson-item:hover .name {
  color: #333;
}

.lesson-item:hover .try {
  opacity: 1;
}

.course-side {
  width: 300px;
  height: auto;
  margin-left: 20px;
  float: right;
}

.teacher-info {
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #f0f0f0;
}

.side-title {
  font-weight: normal;
  font-size: 17px;
  color: #4a4a4a;
  padding: 18px 14px;
  border-bottom: 1px solid #333;
  border-bottom-color: rgba(51, 51, 51, .05);
}

.side-title span {
  display: inline-block;
  border-left: 2px solid #ffc210;
  padding-left: 12px;
}

.teacher-content {
  padding: 30px 20px;
  box-sizing: border-box;
}

.teacher-content .cont1 {
  margin-bottom: 12px;
  overflow: hidden;
}

.teacher-content .cont1 img {
  width: 54px;
  height: 54px;
  margin-right: 12px;
  float: left;
}

.teacher-content .cont1 .name {
  float: right;
}

.teacher-content .cont1 .teacher-name {
  width: 188px;
  font-size: 16px;
  color: #4a4a4a;
  padding-bottom: 4px;
}

.teacher-content .cont1 .teacher-title {
  width: 188px;
  font-size: 13px;
  color: #9b9b9b;
  white-space: nowrap;
}

.teacher-content .narrative {
  font-size: 14px;
  color: #666;
  line-height: 24px;
}
</style>
