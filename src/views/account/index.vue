<template>
  <el-row>
    <el-col :span="15">
      <div class="box">
        <h2>账户信息</h2>
      </div>
      <el-row>
        <el-col :span="17">
           <el-form :model="profile">
            <el-form-item label="媒体名称">
              <el-input v-model="profile.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介">
              <el-input v-model="profile.intro" placeholder="请输入简介"></el-input>
            </el-form-item>
            <el-form-item label="头条号ID">
              <el-input v-model="profile.id" placeholder="请输入头条号"></el-input>
            </el-form-item>
            <el-form-item label="绑定手机号">
              <el-input v-model="profile.mobile" placeholder="请输入绑定手机"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profile.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type='success' @click='handleAlter'>点击修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span='7'>
          <div class="upload">
            <h4>头像设置</h4>
            <!-- 这些都是他自己带的 -->
            <!-- 可以给action设置 请求地址 -->
            <!-- 不可以设置请求方式 -->
            <!-- 可以设置请求头 header -->
            <!-- data 设置请求数据 -->
             <el-upload
                v-loading='loading'
                class="avatar-uploader"
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
                :show-file-list="false"
                :http-request="handleUploads">
                <img v-if="profile.photo" :src="profile.photo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            <p>点击上传图像</p>
          </div>
        </el-col>
  </el-row>
</template>
<script>
export default {
  data () {
    return {
      profile: {},
      loading: false
    }
  },
  created () {
    this.userProfile()
  },
  methods: {
    async userProfile () {
      try {
        const res = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })
        // 他是一个对象 会报错
        res.data.data.id = Number(res.data.data.id)
        this.profile = res.data.data
      } catch (err) {
        this.$message.error('信息初始化错误')
      }
    },
    async handleAlter () {
      const { name, intro, email } = this.profile
      try {
        const res = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          }
        })
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.userProfile()
        res.data.data.id = Number(res.data.data.id)
        this.$store.commit('changeUser', res.data.data)
        // 在这里调用
      } catch (err) {
        this.$message.error('修改失败')
      }
    },
    async handleUploads (e) {
      this.loading = true
      // console.log(e)
      let fd = new FormData()
      fd.append('photo', e.file)
      try {
        const res = await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: fd
        })
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.loading = false
        this.userProfile()
        // 现在就是后台的资料和图像都更新好了
        // 但是本地存储没有更新
        // 所以其他地方是用本地存储的都没有更新
        // 这这里更改store信息
        this.$store.commit('changeUser', res.data.data)
      } catch (err) {
        this.$message.error('上传参数错误')
        this.loading = false
      }
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
