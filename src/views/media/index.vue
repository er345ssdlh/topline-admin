<template>
    <el-card>
        <div class="box">
            <el-radio-group v-model="radio" size="small">
            <el-radio-button label="全部" @click.native="MaterialList(false)"></el-radio-button>
            <el-radio-button label="收藏" @click.native="MaterialList(true)"></el-radio-button>
            </el-radio-group>
            <!-- 使用组件自带的请求来请求上传图片接口上传图片，因为这个接口刚好就是POST 组件默认请求方式就是POST -->
            <el-upload
              class="upload-demo"
              action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
              :headers="{ Authorization: `Bearer ${$store.state.user.token}`}"
              name="image"
              :show-file-list="false"
              :on-success="handleUpSuccess"
              multiple
              :limit="3">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </div>
        <el-row :gutter="20">
            <el-col :span="4" v-for='item in images' :key="item.id">
                <el-card :body-style="{ padding: '0px' }">
                <img :src="item.url" class="image">
                <div style="padding: 14px;">
                      <!-- 三元表达式判断状态 展示相应的按钮样式 -->
                    <el-button type="warning" :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle @click="handleCollect(item)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handeleDelete(item)"></el-button>
                </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
  data () {
    return {
      radio: '',
      images: {}
    }
  },
  created () {
    this.MaterialList()
    this.radio = '全部'
  },
  methods: {
    async handleUpSuccess () {
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.MaterialList()
    },
    async MaterialList (collect = false) {
      try {
        const res = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect,
            page: 1,
            per_page: 10
          }
        })
        this.images = res.data.data.results
      } catch (err) {
        this.$message.error('获取素材列表出错')
      }
    },
    async handleCollect (e) {
      try {
        const res = await this.$http({
          method: 'PUT',
          url: `/user/images/${e.id}`,
          data: {
            collect: !e.is_collected
          }
        })
        let speak = ''
        if (res.data.data.collect) {
          speak = '收藏成功'
        } else {
          speak = '取消收藏成功'
        }
        this.$message({
          type: 'success',
          message: speak
        })
        this.MaterialList()
      } catch (err) {
        this.$message.error('收藏失败')
      }
    },
    async handeleDelete (e) {
      try {
        await this.$confirm('是否永久删除素材', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${e.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.MaterialList()
      } catch (err) {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message.error('删除图片素材失败')
        }
      }
    }
  }
}
</script>
<style>
</style>
<style lang="less" scoped>
.time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .image {
    width: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
  .box{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
</style>
