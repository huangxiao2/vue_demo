<template>
  <div>
<!--    权限列表-->
    <h3></h3>

<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片区域-->
    <el-card>
      <!--    表格区域-->
      <el-table :data="rightlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="rights_name" label="权限名称"></el-table-column>
        <el-table-column prop="rights_path" label="权限路径"></el-table-column>
        <el-table-column prop="rights_level" label="权限等级">
<!--          使用不具名插槽-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.rights_level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.rights_level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
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
      rightlist: []
    }
  },
  created() {
    this.getAllRoleList()
  },
  methods: {
    async getAllRoleList() {
      const { data: res } = await this.$http.get('/rights/getRightsList')
      if (res.code !== 200) return this.$message.error('获取权限列表失败')
      this.rightlist = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
