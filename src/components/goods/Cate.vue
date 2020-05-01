<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" :border="false">

      </tree-table>

      <el-pagination
        :current-page='queryInfo.pageNum'
        :page-sizes='[1, 2, 5, 10]'
        :page-size='queryInfo.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      queryInfo: {
        type: '3',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'goods_name'
      }]
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('/goods/getGoodsTypeList', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取列表失败')
      this.catelist = res.result
      this.total = res.total
    }
  }
}
</script>

<style lang="less" scoped>

</style>
