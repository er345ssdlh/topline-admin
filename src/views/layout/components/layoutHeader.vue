<template>
    <div class="layoutHeader">
        <i class="iconfont toplinetoutiao1"></i>
        <span>黑马头条</span>
        <div class="dropdown">
            <img :src='userInfo.photo' alt="">
            <el-dropdown trigger="click">
                <el-button type="primary">
                    {{ userInfo.name }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>git地址</el-dropdown-item>
                    <el-dropdown-item  @click.native='handleclick'>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { removeUser, getUser } from '@/utils/auth'
// import { getUser } from '@/utils/auth'
//   export default {
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    handleclick () {
      this.$confirm('确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        removeUser()
        this.$router.push({ name: 'login' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.userInfo = JSON.parse(getUser())
  }
}

</script>

<style lang='less' scoped>
.layoutHeader{
    line-height: 60px;
}
.dropdown{
    float: right;
    display: flex;
    height: 60px;
    align-items: center;
    img{
        display: inline-block;
        height: 50px;
        margin-right: 10px;
        border-radius: 50%;
    }
}
.iconfont{
    margin: 0 20px 0 10px;
    font-size: 20px;
}
</style>
