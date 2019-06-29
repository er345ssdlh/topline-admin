<template>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="title"
      label="标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="total_comment_count"
      label="总评论数">
    </el-table-column>
    <el-table-column
      prop="fans_comment_count"
      label="粉丝评论数">
    </el-table-column>
    <el-table-column
      label="评论状态"
      width="180">
      <template slot-scope="scope">
        <!-- 点击修改了tableDate里的数据，但是一刷新就会重新获取后台的给tableDate 所以需要点击修改后台 -->
        <!-- 先给disabled一个没有的值，转为布尔就是false -->
        <el-switch
          v-model="scope.row.comment_status"
          :disabled="scope.row.condition"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleCommentStatus(scope.row)">
          <!-- scope.row.comment_status -->
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" v-model="scope.row" size='small'>修改</el-button>
        <el-button type="success"  size='small'>打开评论</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'my-comment',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.commentLink()
  },
  methods: {
    async commentLink () {
      try {
        const res = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            response_type: 'comment'
          }
        })
        res.data.data.results.forEach(item => {
          item.condition = false
        })
        this.tableData = res.data.data.results
      } catch (err) {
        this.$message.error('获取评论列表错误')
      }
    },
    async handleCommentStatus (e) {
      e.condition = true
      // true是开的状态 false 是关闭的状态
      try {
        const res = await this.$http({
          method: 'PUT',
          url: `/comments/status?article_id=${e.id.toString()}`,
          data: {
            allow_comment: e.comment_status
          }
        })
        this.$message({
          type: 'success',
          message: `已${res.data.data.allow_comment ? '启用' : '禁止'}`
        })
      } catch (err) {
        this.$message.error('修改评论状态出错')
        e.comment_status = !e.comment_status
      }
      e.condition = false
    }
  }
}
</script>
<style>

</style>
