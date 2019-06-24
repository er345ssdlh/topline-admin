<template>
  <div class="login">
    <!-- :model 表单数据对象 -->
    <!-- 说白了 其实能验证 他就是 （用:model 设置的数据对象里找 prop="xxx" 这个数据然后和规则作对比）  -->
    <!-- ref='userCodeverify' -->
    <!-- 失去焦点时候要验证，点击发送验证码之前也要验证 ref='userCodeverify' 就是Vue获取Dom节点的方法，再调用this.$refs[userCodeverify]-->
    <el-form class="login-form" :model="user" ref='userCodeverify' :rules='verify'>
      <div class="login-logo">
        <img src="./logo_admin.png" alt="logo">
      </div>
      <!-- 手机 -->
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码" class="login-code"></el-input>
        <el-button @click="handleCode" :disabled='bool'>{{ codeDisabled }}</el-button>
      </el-form-item>
      <div id="captchaBox"></div>
      <el-form-item prop="notice">
        <!-- // 添加一个同意阅读 -->
         <el-checkbox class="agreementBox" v-model="user.notice"></el-checkbox>
         <span  class="agreementText">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
      </el-form-item>
      <el-button type="primary" class="login-submit" @click="handleEnter">登录</el-button>
    </el-form>
  </div>
</template>
<script>
// 导入axios
import axios from 'axios'
// 导入极验
import '@/wendor/gt.js'
// 登录页有一个设置本地存储账号信息的
import { setUser } from '@/utils/auth'

const CountDown = 300

export default {
  data () {
    return {
      user: {
        mobile: '',
        code: '',
        notice: ''
      },
      verify: {
        mobile: [
          // 必须填 要不然 在啥时候触发
          { required: true, message: '请输入手机号啊', trigger: 'blur' },
          { pattern: /\d{11}/, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /\d{6}/, message: '验证码有误', trigger: 'blur' }
        ],
        // 添加一个用户条例多选按钮
        notice: [
          // 必须填  不然 提示
          { required: true, message: '请认真阅读条例并同意' },
          { pattern: /true/, message: '请认真阅读条例并同意' }
        ]
      },
      codeDisabled: '获取验证码',
      bool: false,
      total: CountDown
    }
  },
  methods: {
    handleCode () {
      // 通过Dom找到el-from这个Dom节点再.validateFiled方法对单独进行验证 成功不返回东西，失败返回提示信息
      this.$refs['userCodeverify'].validateField('mobile', errorMessage => {
        if (!errorMessage.length) {
          this.SendCode()
        }
      })
    },
    /**
     * 请求人机交互接口，使用极验，请求短信接口
    */
    SendCode () {
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
                  this.CodeCountDown()
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
    },
    /**
     * 倒计时
    */
    CodeCountDown () {
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
    },
    /**
     * 点击登录按钮
    */
    handleEnter () {
      this.$refs['userCodeverify'].validate(valie => {
        // console.log(valie)
        // 如果都验证成功了，就发送登录请求
        if (valie) {
          this.RingUp()
        }
      })
    },
    /**
     * 登录
    */
    RingUp () {
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
        // window.localStorage.setItem('userInfo', JSON.stringify(res.data.data))
        setUser(JSON.stringify(res.data.data))
        // 状态码200-400来这里
        // console.log(res)
        // this.$router.push('/')
        // 如果锚点地址太长,使用下边的
        // ----------------------------这里就是登陆完成了
        this.$message({
          message: '登录成功',
          type: 'success'
        })
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
  padding-bottom: 20px;
  img{
    width: 60%;
  }
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
.agreementBox{
  margin-right: 10px;
}
.agreementText{
  font-size: 15px;
  color: #666;
}
</style>
