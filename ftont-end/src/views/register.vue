<template>
  <div class="box">
    <img src="../static/image/background.jpg" alt="">
    <div class="register">
      <div id="q">
        <img src="../static/image/logo.png" alt="" id="qq">
        <p></p>
      </div>
      <div class="register_box">
        <div class="register-title">百知教育在线平台注册</div>
        <div class="inp">
          <input v-model="phone" type="text" placeholder="手机号码" class="user" @blur="check_phone">
          <span v-if="show_phone" style="color: red">手机号不符合规则</span>
          <span v-if="show_phone1" style="color: red">手机号已存在</span>
          <input v-model="password" type="password" placeholder="登录密码" class="user" @blur="check_pwd">
          <span v-if="show_pwd" style="color: red">密码不符合规则</span>
          <div id="geetest"></div>
          <div class="sms-box">
            <input v-model="code" type="text" maxlength="6" placeholder="输入验证码" class="user">
            <div class="sms-btn" v-if="show_time" @click="timeing" :disabled="dis">获取验证码</div>
            <div class="sms-btn" v-if="!show_time">{{ auth_time }}秒后重试</div>
          </div>
          <button class="register_btn" @click="request_bu">注册</button>
          <p class="go_login">已有账号
            <!--                        <router-link to="/login">直接登录</router-link>-->
            <span @click="log_in">直接登录</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      dis: true,//是否可以点击获取验证码
      code: '',
      auth_time: 0,//倒计时
      show_phone: false, //检验电话的
      show_phone1: false, //检验电话的
      show_pwd: false,//检验密码的
      show_time: true,//决定是否显示时间的
      phone: "",
      password: "",
    }
  },
  methods: {
    log_in() {
      this.$router.push("/login")
    },
    // 电话号码检验
    check_phone() {
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
            this.dis = false
            this.show_phone = false
          } else {  //如果返回错误信息
            this.dis = true
            this.show_phone1 = true
          }
        })


      }
    },
    //密码校验
    check_pwd() {
      let pwd = new RegExp('^(?![a-zA-z]+$)(?!\\d+$)')
      if (this.password === '' || this.password.indexOf(" ") !== -1 || !pwd.test(this.password)) {
        this.dis = true
        this.show_pwd = true
      } else {
        this.dis = false
        this.show_pwd = false
      }
    },
    //注册按钮
    request_bu() {
      if (this.show_phone !== true && this.show_pwd !== true && this.phone !== "" && this.password !== "" && this.show_phone1 !== true) {
        this.$axios({
          url: 'http://127.0.0.1:8000/apiv2/register/',
          method: 'post',
          data: {
            "phone": this.phone,
            "password": this.password,
            "code": this.code
          }
        }).then(res => {
          console.log(res.data, res.status, res.data.token, res.data.message);
          if (res.data.token) {
            this.$message({
              'message': '注册成功',
              'type': 'success',
              'duration': 2000
            })
            localStorage.setItem('username', this.phone)
            this.$router.push("/")
          }
        }).catch(errors => {
          console.log(errors, errors.message, 96);
          this.$message({
            "message": "验证码错误，或已经过期",
            'type': 'error',
            'duration': 2000
          })
        })
      } else {
        this.$message({
          "message": "输入信息不合法",
          'type': 'error',
          'duration': 2000
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
    }
  }
}
</script>

<style scoped>
#qq {
  width: 200px;
}

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

.box .register {
  position: absolute;
  width: 500px;
  height: 400px;
  top: 50px;
  left: 0;
  margin: auto;
  right: 0;
  bottom: 0;
  top: -338px;
}

.register .register-title {
  width: 100%;
  font-size: 24px;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 30px;
  color: #4a4a4a;
  letter-spacing: .39px;
}

.register-title img {
  width: 190px;
  height: auto;
}

.register-title p {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #fff;
  letter-spacing: .29px;
  padding-top: 10px;
  padding-bottom: 50px;
}

.register_box {
  width: 400px;
  height: auto;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
  border-radius: 4px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.register_box .title {
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

.register_box .title span:nth-of-type(1) {
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

.register_btn {
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