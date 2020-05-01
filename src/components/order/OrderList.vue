<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="toAdd">添加订单</el-button>
        </el-col>
      </el-row>

<!--      表格区域-->
      <el-table :data="orderlistdata" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_id" label="订单编号"></el-table-column>
        <el-table-column prop="order_type" label="订单类型"></el-table-column>
        <el-table-column prop="order_money" label="订单总金额"></el-table-column>
        <el-table-column prop="cus_name" label="客户名称"></el-table-column>
        <el-table-column prop="order_position" label="送货地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <pre>
              {{scope.row}}
            </pre>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderlistdata: [],
      queryInfo: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0
    }
  },
  created() {
    this.getorderlist()
  },
  methods: {
    async getorderlist() {
      const { data: res } = await this.$http.get('/orders/getOrderList', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取列表失败')
      this.orderlistdata = res.data
    },
    toAdd() {
      this.$router.push('./addOrder')
    }
  }
}
</script>

<style lang="less" scoped></style>
