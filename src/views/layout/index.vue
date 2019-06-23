<template>
    <div class="layout">
        <el-container class="container">
            <el-aside width="200px" class="Aside">
                <AppSide>
                </AppSide>
            </el-aside>
            <el-container>
                <el-header class="Header">
                    <AppHeader>
                    </AppHeader>
                </el-header>
                <el-main class="Main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import AppSide from './components/layoutAside'
import AppHeader from './components/layoutHeader'
export default {
  components: {
    AppSide,
    AppHeader
  }
}
</script>

<style lang='less' scoped>
.layout{
    height: 100%;
}
.container{
    height: 100%;
}
.Aside{
    background-color: #505569;
}
.Main{
    background-color: #F2F3F5;
}
.Header{
    background-color: #ffffff;
}
</style>
