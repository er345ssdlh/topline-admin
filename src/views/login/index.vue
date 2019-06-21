<template>
  <div class="login">
    <el-form class="login-form">
      <div class="login-logo">
        <img src="./logo_admin.png" alt="logo">
      </div>
      <el-form-item>
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.code" placeholder="请输入验证码" class="login-code"></el-input>
        <el-button @click="handleCode" :disabled='bool'>{{ codeDisabled }}</el-button>
      </el-form-item>
      <div id="captchaBox"></div>
      <el-button type="primary" class="login-submit" @click="handleEnter">登录</el-button>
    </el-form>
  </div>
</template>
<script>
// 导入axios
import axios from 'axios'
// 导入极验
import '@/wendor/gt.js'

export default {
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      codeDisabled: '获取验证码',
      bool: false,
      total: 300
    }
  },
  methods: {
    handleCode () {
      // 发送验证码
      const { mobile } = this.user
      axios({
        method: 'get',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // 只有在手机格式正确，才会提交后端成功
        // 成功后，后端会给我们一些数据，我们不需要知道这些数据是什么
        // 直接去访问极客服务器，把后端给我们的这些数据给极客服务器即可
        // console.log(res.data.data);
        // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
        const data = res.data.data
        // eslint规定  全局 要加window
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: true,
            product: 'popup'
          },
          (captchaObj) => {
            // console.log(captchaObj)
            // captchaObj 验证对象
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.appendTo('#captchaBox') // 页面上要添加id为captchaBox的盒子，并且要设置宽高才行
            captchaObj
              .onReady(() => {
                // your code
              })
              .onSuccess(() => {
                // 验证成功了  进来 captchaObj.getValidate() 就拿到了结果，这个结果正好是后端短信验证接
                // 口需要的数据，我们来在这里请求这个接口吧
                // console.log(captchaObj.getValidate())
                const {
                  geetest_challenge: challenge,
                  geetest_validate: validate,
                  geetest_seccode: seccode
                } = captchaObj.getValidate()
                // console.log(challenge, '------------' + validate, '-------------' + seccode + ' -----')
                // console.log(mobile)
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge,
                    validate,
                    seccode
                  }
                }).then(res => {
                  // -----------------------成功发送短信了 这时候应该给按钮设置倒计时，倒计时未到0 禁止点击
                  this.bool = true
                  let clock = setInterval(() => {
                    this.total--
                    this.codeDisabled = this.total + '后重新发送'
                    if (this.total === 0) {
                      clearInterval(clock)
                      this.bool = false
                      this.codeDisabled = '获取验证码'
                    }
                  }, 1000)
                })
              })
              .onError(() => {
                // your code
              })
          }
        )
      }).catch((rej) => {
        this.$message.error('请检查手机格式是否正确')
      })
      // 这里放置定时器  计时按钮
      // this.bool = true
      // let clock = setInterval(() => {
      //   this.total--
      //   this.codeDisabled = this.total + '后重新发送'
      //   if (this.total === 0) {
      //     clearInterval(clock)
      //     this.bool = false
      //     this.codeDisabled = '获取验证码'
      //   }
      // }, 1000)
    },
    handleEnter () {
      // console.log(this.user.mobile,this.user.code)
      // 非实名认证不可以上 得去http://toutiao.research.itcast.cn/#/user 注册
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: {
          mobile: this.user.mobile,
          code: this.user.code
        }
      }).then(res => {
        // 状态码200-400来这里
        // console.log(res)
        // this.$router.push('/')
        // 如果锚点地址太长,使用下边的
        // ----------------------------这里就是登陆完成了
        this.$router.push({
          name: 'r-home'
        })
      }).catch((rej) => {
        this.$message.error('账号或者验证码不正确')
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("./login-bgi.jpg") left top;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-logo {
  width: 100%;
  text-align: center;
  padding-bottom: 10px;
}
.login-form {
  width: 350px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
.login-code {
  width: 55%;
  padding-right: 15px;
}
.login-submit {
  width: 100%;
}
#captchaBox {
  width: 100%;
  height: 60px;
display: flex;
justify-content: center;
}
</style>
