<template>
    <div class="layoutAside">
        <div class="logo">
            <img src="../../../assets/logo_admin.png" alt="">
        </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      >
      <!--  -->
      <el-menu-item index="/">
        <i class="iconfont toplineindex-copy"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!--  -->
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont toplineneirongguanli"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="">
          <i class="iconfont toplinefabuwenzhang"></i>
          <span slot="title">发布文章</span>
          </el-menu-item>
          <el-menu-item index="/article">
            <i class="iconfont iconfont toplineneirongliebiao"></i>
            <span slot="title">内容列表</span>
            </el-menu-item>
          <el-menu-item index="2-3">
            <i class="iconfont toplinepinglun-liebiao"></i>
            <span slot="title">评论列表</span>
            </el-menu-item>
          <el-menu-item index="2-3">
            <i class="iconfont toplinesucaiguanli"></i>
            <span slot="title">素材管理</span>
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--  -->
      <el-submenu index="3">
        <template slot="title">
          <i class="iconfont toplinefensi1"></i>
          <span>粉丝管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">
            <i class="iconfont toplineshuju2"></i>
            <span slot="title">图文数据</span>
            </el-menu-item>
          <el-menu-item index="3-2">
            <i class="iconfont toplinefensi"></i>
            <span slot="title">粉丝概况</span>
            </el-menu-item>
          <el-menu-item index="3-3">
            <i class="iconfont toplinefensihuaxiang"></i>
            <span slot="title">粉丝画像</span>
            </el-menu-item>
          <el-menu-item index="3-3">
            <i class="iconfont toplinefensiliebiao"></i>
            <span slot="title">粉丝列表</span>
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--  -->
      <el-menu-item index="4">
        <i class="iconfont toplinezhanghuxinxi"></i>
        <span slot="title">账户信息</span>
      </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
export default {}
</script>

<style lang='less' scoped>
.logo{
    width: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    img{
        width: 66%;
    }
}
i{
  margin:0 20px 0 10px;
  font-size: 18px;
}
</style>
