<template>
  <div>
    <el-form :model="ArtikelZustand" label-width="80px" class="ar-form">
          <div class="box">
            <h2>文章筛选</h2>
          </div>
      <el-form-item label="文章状态">
        <!-- 文章状态 -->
        <el-radio-group v-model="ArtikelZustand.status">
           <!-- 全部就是不传值，不传值就是没有对应条件 切记他也要传value -->
          <el-radio :value=undefined>全部</el-radio>
          <el-radio v-for="(item,index) in TagType" :label="index" :key='item.label' :value="index">{{ item.lable }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 文章频道 -->
      <el-form-item label="频道列表">
        <el-select v-model="ArtikelZustand.channel_id" placeholder="请选择频道">
          <!-- 全部就是不传值，不传值就是没有对应条件 -->
          <el-option :value=undefined>全部</el-option>
          <el-option v-for='item in myChannel' :key='item.id' :label="item.name" :value="item.id">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <!-- 时间 -->
      <el-form-item label="活动时间">
        <el-col :span="11">
         <el-date-picker
          value-format="yyyy-MM-dd"
          @change="handleChanggeDate"
          v-model="ArtikelZustandDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click='handleDemand' :loading="articleLoading">查询</el-button>
      </el-form-item>
    </el-form>
      <!-- 表格 这个 ElementUI 给封装的很彻底-->
        <!-- :data='tableData'  获取数组tableData -->
        <div class="ar-table">
          <div class="box">
            <h3>一共有{{ totalCount }}条数据</h3>
          </div>
          <el-table :data='tableData' style='width: 100%' v-loading='articleLoading' >
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
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" round @click='handleEdit(scope.row.id)'>编辑</el-button>
                    <el-button type="danger" size="mini" round @click="handleClickArticle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
            <!-- :page-size="per_page"每页显示多少条 -->
            <!-- :total="totalCount"总条数 -->
    <el-pagination
        :current-page="page"
        :disabled = 'articleLoading'
        :page-size="per_page"
        layout="prev, pager, next"
        :total="totalCount"
        @current-change='handlePaginationChange'
        class="ar-pagination">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'my-article',
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
      ArtikelZustand: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      // 这个只是为了保存开始和结束时间
      ArtikelZustandDate: '',
      myChannel: [],
      //  第二步  设置每页显示多少 默认是10
      per_page: 10,
      totalCount: 0,
      page: 1,
      articleLoading: false
    }
  },
  created () {
    this.ArticleList()
    this.channel()
  },
  methods: {
    async ArticleList () {
      this.articleLoading = true
      // 循环处理点击全部的时候的未定义为空
      const newArtikelZustand = {}
      for (var item in this.ArtikelZustand) {
        // 如果有这个值或者等于零
        if (this.ArtikelZustand[item] !== null && this.ArtikelZustand[item] !== undefined && this.ArtikelZustand[item] !== '') {
          newArtikelZustand[item] = this.ArtikelZustand[item]
        }
      }
      console.log(newArtikelZustand)
      const essay = await this.$http({
        method: 'get',
        url: '/articles',
        // 所有接口都需要token
        // 设置接口拦截器
        params: {
          //  第三步 发请求 也要每页十条
          per_page: this.per_page,
          //  第四步 设置页码为数据保存的页码数
          page: this.page,
          ...newArtikelZustand
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
    },
    async channel () {
      try {
        const res = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        this.myChannel = res.data.data.channels
      } catch (err) {
        this.articleLoading = false
        this.$message.error('获取频道列表失败')
      }
    },
    handleChanggeDate () {
      if (this.ArtikelZustandDate === null) {
        this.ArtikelZustand.begin_pubdate = undefined
        this.ArtikelZustand.end_pubdate = undefined
      } else {
        this.ArtikelZustand.begin_pubdate = this.ArtikelZustandDate[0]
        this.ArtikelZustand.end_pubdate = this.ArtikelZustandDate[1]
      }
    },
    handleDemand () {
      // 查询
      this.page = 1
      this.ArticleList()
    },
    async handleClickArticle (e) {
      // 这个获取的e有问题
      console.log(e.toString())
      try {
        await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http({
          method: 'DELETE',
          url: `/articles/${e.toString()}`
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 再遍历一遍
        this.ArticleList()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
      }
    },
    async handleEdit (e) {
      this.$router.push(`/publish/${e}`)
    }
  }
}
</script>
<style lang='less' scoped>
img{
  width: 40px;
  height: 40px;
}
.ar-form{
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
}
.ar-table{
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
    .box{
    padding: 10px;
    border-bottom: 1px solid #aaa;
  }
}
.ar-pagination{
  background-color: #fff;
  margin-top: 5px;
}
.box{
  padding: 10px;
}
</style>
