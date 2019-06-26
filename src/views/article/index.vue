<template>
  <div>
      <!-- 表格 这个 ElementUI 给封装的很彻底-->
        <!-- :data='tableData'  获取数组tableData -->
    <el-table :data='tableData' style='width: 100%' v-loading='articleLoading'>
        <!-- prop 获取tableData里某一项 遍历 -->
      <el-table-column label='封面' width='180'>
          <!-- 如果需要其他输出方式  则自定义表格列 template  定制 注意，一定要加 slot-scope=‘scope’
          -->
        <template slot-scope="scope">
            <!-- 自定义表格列  图片数量不确定 他可以循环 -->
            <img v-for="item in scope.row.cover.images" :key="item" :src="item" alt="封面图片">
        </template>
      </el-table-column>
      <el-table-column prop='title' label='标题' width='180'></el-table-column>
      <el-table-column prop='pubdate' label='发布时间' width='180'></el-table-column>
      <el-table-column label='状态'>
          <template slot-scope="scope">
              <!-- 类型为TagTap下 aixos返回的第scope.row.status个 的type -->
              <!-- 这样就不用一大堆的判断了 优化点 -->
              <el-tag :type="TagType[scope.row.status].type">{{ TagType[scope.row.status].lable }}</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop='' label='操作'>
          <template>
              <el-button type="primary" size="mini" round>编辑</el-button>
              <el-button type="danger" size="mini" round>删除</el-button>
          </template>
      </el-table-column>
    </el-table>
            <!-- :page-size="per_page"每页显示多少条 -->
            <!-- :total="totalCount"总条数 -->
        <el-pagination
            :disabled = 'articleLoading'
            :page-size="per_page"
            layout="prev, pager, next"
            :total="totalCount"
            @current-change='handlePaginationChange'>
        </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      TagType: [
        {
          type: 'info',
          lable: '草稿'
        },
        {
          type: '',
          lable: '待审核'
        },
        {
          type: 'success',
          lable: '审核通过'
        },
        {
          type: 'warning',
          lable: '审核失败'
        },
        {
          type: 'danger',
          lable: '已删除'
        }
      ],
      //  第二步  设置每页显示多少 默认是10
      per_page: 10,
      totalCount: 0,
      page: 1,
      articleLoading: false
    }
  },
  created () {
    this.ArticleList()
  },
  methods: {
    async ArticleList () {
      this.articleLoading = true
      const essay = await this.$http({
        method: 'get',
        url: '/articles',
        // 所有接口都需要token
        // 设置接口拦截器
        params: {
          //  第三步 发请求 也要每页十条
          per_page: this.per_page,
          //  第四步 设置页码为数据保存的页码数
          page: this.page
        }
      })
      //  收到文章列表啦
      this.tableData = essay.data.data.results
      //  第一步 页码的总数条目数，等于返回来的数据里总条目数
      this.totalCount = essay.data.data.total_count
      this.articleLoading = false
    },
    handlePaginationChange (page) {
      // 第五步 改变执行函数的时候 回调参数就为不断更改页码数，改变了数据页码数 第四步跟着改变
      this.page = page
      // 第六步重新执行
      this.ArticleList()
    }
  }
}
</script>
<style>
</style>
