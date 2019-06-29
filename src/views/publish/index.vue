<template>
    <el-row>
      <el-col>
        <div class="box">
          <h2>文章发布</h2>
        </div>
          <el-form ref="form" :rules="rules" :model="addArticle" class="from" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="addArticle.title" placeholder="文章标题"></el-input>
              </el-form-item>
              <el-form-item label="内容">
                <quill-editor class="editer" v-model="addArticle.content"
                  ref="myQuillEditor"
                  :options="editorOption"
                  >
                </quill-editor>
              </el-form-item>
            <el-form-item label="封面">
              <!-- <el-radio-group v-model="addArticle.cover"> -->
              <el-radio-group>
                <el-radio label="单图"></el-radio>
                <el-radio label="三图"></el-radio>
                <el-radio label="无图"></el-radio>
                <el-radio label="自动"></el-radio>
              </el-radio-group>
            </el-form-item>
              <el-form-item label="频道">
                <el-select v-model="addArticle.channel_id" placeholder="请选择频道">
                <!-- 全部就是不传值，不传值就是没有对应条件 -->
                  <el-option :value=undefined>全部</el-option>
                  <el-option v-for='item in myChannel' :key='item.id' :label="item.name" :value="item.id">{{ item.name }}</el-option>
              </el-select>
              </el-form-item>
              <div class="box">
                <el-button type="primary" class="btn" @click="handleSddArticle(true)">保存草稿</el-button>
                <el-button type="success" class="btn" @click="handleSddArticle(false)">发布</el-button>
              </div>
          </el-form>
      </el-col>
    </el-row>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'my-publish',
  components: {
    quillEditor
  },
  data () {
    return {
      editorOption: { /* quill options */ },
      imageUrl: '',
      addArticle: {
        // 标题
        title: '',
        // 内容
        content: '',
        // 封面
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        // 频道id
        channel_id: ''
      },
      myChannel: [],
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.channel()
    // 如果router.name=r-publish-edit  也就是如果是点击编辑进来的
    if (this.$route.name === 'r-publish-edit') {
      this.edit()
    }
  },
  methods: {
    async handleSddArticle (e) {
      try {
        const res = await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft: e
          },
          data: this.addArticle
        })
        console.log(res)
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$router.push('/article')
      } catch (err) {
        this.$message.error('添加失败')
      }
    },
    async channel () {
      try {
        const res = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        this.myChannel = res.data.data.channels
      } catch (err) {
        this.$message.error('获取频道列表失败')
      }
    },
    async edit () {
      try {
        const res = await this.$http({
          method: 'GET',
          url: `/articles/${this.$route.params.id}`
        })
        console.dir(res.data.data)
        this.addArticle = res.data.data
      } catch (err) {
        this.$message.error('获取文章出错！')
      }
    }
  }
}
</script>
<style>
.ql-editor{
  height: 400px;
}
</style>

<style lang='less'>
.box{
  color: #555;
.btn{
  margin:0 50px;
}
}
.from{
  padding: 20px;
}
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
  .editer{
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
