<template>
  <div class="login box">
    <img src="../static/image/background.jpg" alt="" style="background: rgba(0,0,0,0.1)">
    <div class="login">
      <div class="login-title">
        <img src="../static/image/logo.png" alt="">
        <p></p>
      </div>
      <div class="login_box">
        <div class="title">
          <span @click="log">密码登录</span>
          <span @click="mes">短信登录</span>
        </div>
        <div class="inp" v-if="show">
          <input type="text" placeholder="用户名 / 手机号码 / 邮箱" class="user" v-model="account">
          <input type="password" name="" class="pwd" placeholder="密码" v-model="password">
          <div id="geetest1"></div>
          <div class="rember">
            <p>
              <input type="checkbox" class="no" v-model="remember_me" @click="remember"/>
              <span>记住密码</span>
            </p>
            <p>忘记密码</p>
          </div>
          <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>
          <p class="go_login">没有账号
            <router-link to="/register">立即注册</router-link>
          </p>
        </div>
        <div class="inp" v-else>
          <input type="text" placeholder="手机号码" class="user" @blur="check_phone" v-model="phone">
          <span v-if="show_phone" style="color: red">手机号不符合规则</span>
          <span v-if="show_phone1" style="color: red">手机号已存在</span>
          <div class="sms-box">
            <input v-model="code" type="text" maxlength="6" placeholder="输入验证码" class="user">
            <div class="sms-btn" v-if="show_time" @click="timeing" :disabled="dis">获取验证码</div>
            <div class="sms-btn" v-if="!show_time">{{ auth_time }}秒后重试</div>
          </div>
          <button class="login_btn" @click="log_in2">登录</button>
          <span class="go_login">没有账号
                    <router-link to="/register">立即注册</router-link>
                </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      code:'',
      phone:'',
      auth_time: 0,//倒计时
      dis: true,//是否可以点击获取验证码
      account: '',
      password: '',
      remember_me: false,
      show: true,
      token: '',
      show_phone: false, //检验电话的
      show_phone1: false, //检验电话的
      show_time: true,//决定是否显示时间的
    }
  },
  created() {
    //****************************加密***********************************
    //引用base64加密
    let Base64 = require('js-base64').Base64
    let status = localStorage.getItem('status')
    if (status) {
      let username = localStorage.getItem('username')
      let pwd = localStorage.getItem('pwd')
      let password = Base64.decode(pwd)
      console.log(password, "************************")
      this.account = username
      this.password = password
    }
    //***************************************************************
  },
  methods: {
    get_captcha() {
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv2/captcha/',
        method: 'get',
        params: {
          username: this.account
        }
      }).then(res => {
        let data = JSON.parse(res.data)
        console.log(data)
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
          offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
          new_captcha: data.new_captcha
        }, this.handlerPopup);
      })
    },
    // 请求验证码的回调函数 完成验证码的验证码
    handlerPopup(captchaObj) {
      // 在回调函数中 this的指向会被改变
      let self = this;
      captchaObj.onSuccess(function () {
        let validate = captchaObj.getValidate();
        console.log(validate.geetest_challenge)
        self.$axios({
          url: "http://127.0.0.1:8000/apiv2/captcha/",
          method: "post",
          data: {
            geetest_challenge: validate.geetest_challenge,
            geetest_validate: validate.geetest_validate,
            geetest_seccode: validate.geetest_seccode
          },
        }).then(res => {
          console.log(res.data);
          // 如果滑块验证码的验证结果为True，则完成登录
          if (res.data.status) {
            self.log_in();
          }
        }).catch(error => {
          console.log(error);
        })
      })
      document.getElementById("geetest1").innerHTML = "";
      captchaObj.appendTo("#geetest1");
    },
    log_in() {
      //*****************************登录按钮***************************
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv2/login/',
        method: 'post',
        data: {
          username: this.account,
          password: this.password
        }
      }).then(res => {
        console.log(res.data, res.status)
        console.log(res.data['token'], 1351351351351315631153351351)
        localStorage.setItem("token", res.data['token'])
        this.$message({
          'message': '登陆成功',
          'type': "success",
          'duration': 2000
        })
        if (this.remember_me === true) {
          let Base64 = require('js-base64').Base64
          let pwd = Base64.encode(this.password)
          console.log(pwd)
          console.log(res.data.token,)
          localStorage.setItem("username", this.account)
          localStorage.setItem("pwd", pwd)
          localStorage.setItem('status', true)
        }
        localStorage.setItem('username', this.account)
        this.$router.push({
          path: '/',
          query:{
          }
        })
      }).catch(errors => {
        console.log(errors)
        this.$message({
          'message': '账户名或密码错误',
          'type': 'error',
          'duration': 2000
        })
      })
    },
    remember() {
      //********************************记住我**************************
      this.remember_me = !this.remember_me
      console.log(this.remember_me)
    },
    mes() {
      //**************************注册**********************************
      console.log(1111)
      this.show = false
    },
    log() {
      //***************************登录*********************************
      this.show = true
    },
    check_phone(){
      let regular = /^[1][3-9][0-9]{9}$/;
      let numRe = new RegExp(regular) //正则检验
      if (this.phone === '' || this.phone.indexOf(" ") !== -1 || !numRe.test(this.phone)) {
        this.dis = true
        this.show_phone = true
      } else {  //如果输入合法执行下面代码
        this.dis = false
        this.show_phone = false
        this.$axios({  //检验验证码是否存在
          url: "http://127.0.0.1:8000/apiv2/check_phone/",
          method: 'get',
          params: {
            phone: this.phone
          }
        }).then(res => { //成功后的逻辑
          console.log(res.data, 69)
          if (res.data.message === "OK") {
            this.dis = true
            this.show_phone1 = true
            this.show_phone = false
          } else {  //如果返回错误信息
            this.dis = false
            // this.show_phone1 = true
          }
        })


      }
    },
    //倒计时
    timeing() {
      this.show_time = false
      this.auth_time = 60
      this.dis = true
      let timeed = setInterval(() => {
        this.auth_time--
        if (this.auth_time <= 0) {
          this.show_time = true
          this.dis = false
          console.log(timeed)
        }
      }, 1000)
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv2/message/',
        method: 'get',
        params: {
          phone: this.phone
        }
      }).then(res => {
        console.log(res.data);
        if (res.data.message === 'OK') {
          this.$message({
            "message": '短信发送成功，请注意查收哦',
            "type": 'success',
            'duration': 3000
          })
        } else if (res.data.message === "ERROR1") {
          this.$message({
            "message": '操作过于频繁，请稍后重试',
            "type": 'error',
            'duration': 3000
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    log_in2(){
      if (this.phone!=="" || this.code!=="" || this.phone.indexOf(" ")!==-1 || this.code.indexOf(' ')!==-1){
        this.$axios({
          url:"http://127.0.0.1:8000/apiv2/messageLogin/",
          method:'post',
          data:{
            phone:this.phone,
            code:this.code
          }
        }).then(res =>{
          console.log(res.data)
          localStorage.setItem("token", res.data)
          localStorage.setItem("username", this.phone)
          console.log(res.data);
          if (res.statusText==="OK"){
            this.$router.push({
              path:'/',
              query:{

              }
            })
          }
        }).catch(error =>{
          console.log(error)
          this.$message({
            'message': '验证码错误',
            'type': "error",
            'duration': 2000
          })
        })
      }
    }
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.box img {
  width: 100%;
  min-height: 100%;
}

.box .login {
  position: absolute;
  width: 500px;
  height: 400px;
  top: 0;
  left: 0;
  margin: auto;
  right: 0;
  bottom: 0;
  top: -338px;
}

.login .login-title {
  width: 100%;
  text-align: center;
}

.login-title img {
  width: 190px;
  height: auto;
}

.login-title p {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #fff;
  letter-spacing: .29px;
  padding-top: 10px;
  padding-bottom: 50px;
}

.login_box {
  width: 400px;
  height: auto;
  background: #fff;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.login_box .title {
  font-size: 20px;
  color: #9b9b9b;
  letter-spacing: .32px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-around;
  padding: 50px 60px 0 60px;
  margin-bottom: 20px;
  cursor: pointer;
}

.login_box .title span:nth-of-type(1) {
  color: #4a4a4a;
  border-bottom: 2px solid #84cc39;
}

.inp {
  width: 350px;
  margin: 0 auto;
}

.inp input {
  border: 0;
  outline: 0;
  width: 100%;
  height: 45px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  text-indent: 20px;
  font-size: 14px;
  background: #fff !important;
}

.inp input.user {
  margin-bottom: 16px;
}

.inp .rember {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-top: 10px;
}

.inp .rember p:first-of-type {
  font-size: 12px;
  color: #4a4a4a;
  letter-spacing: .19px;
  margin-left: 22px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  /*position: relative;*/
}

.inp .rember p:nth-of-type(2) {
  font-size: 14px;
  color: #9b9b9b;
  letter-spacing: .19px;
  cursor: pointer;
}

.inp .rember input {
  outline: 0;
  width: 30px;
  height: 45px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  text-indent: 20px;
  font-size: 14px;
  background: #fff !important;
}

.inp .rember p span {
  display: inline-block;
  font-size: 12px;
  width: 100px;
  /*position: absolute;*/
  /*left: 20px;*/

}

#geetest {
  margin-top: 20px;
}

.login_btn {
  width: 100%;
  height: 45px;
  background: #84cc39;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  letter-spacing: .26px;
  margin-top: 30px;
}

.inp .go_login {
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
  letter-spacing: .26px;
  padding-top: 20px;
}

.inp .go_login span {
  color: #84cc39;
  cursor: pointer;
}

.qqq {
  background: rgba(255, 255, 255, 0.5);
}
.sms-box {
  position: relative;
}
.sms-btn {
  font-size: 14px;
  color: #ffc210;
  letter-spacing: .26px;
  position: absolute;
  right: 16px;
  top: 10px;
  cursor: pointer;
  overflow: hidden;
  background: #fff;
  border-left: 1px solid #484848;
  padding-left: 16px;
  padding-bottom: 4px;
}
</style>