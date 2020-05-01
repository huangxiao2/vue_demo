<template>
  <div>
<!--    <h3>角色列表</h3>-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolelist" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbuttom',index===0?'bdtop':'','vcenter']" v-for="(item,index) in scope.row.child" :key="item.rights_id">
              <el-col :span="5">
                <el-tag closable @close="deleteTag(scope.row,item)">{{item.rights_name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index1 === 0?'':'bdtop','vcenter']" v-for="(item1,index1) in item.child" :key="item1.rights_id">
                  <el-col :span="8">
                    <el-tag closable type="warning"  @close="deleteTag(scope.row,item1)">{{item1.rights_name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag closable type="success" v-for="item2 in item1.child" :key="item2.rights_id" @close="deleteTag(scope.row,item2)">{{item2.rights_name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="role_name" label="角色名称"></el-table-column>
        <el-table-column prop="role_desc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <!--          使用不具名插槽-->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">{{scope.row.role_id}}</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <el-dialog title="分配权限"
      :visible.sync="dialogVisible"
      width="50%" @close="setRightsClose">

      <el-tree :data="rightslist" :props="rightsProps" show-checkbox node-key="rights_id" default-expand-all :default-checked-keys="defKeys" ref="rightsTreeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allowRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogVisible: false,
      rightslist: [],
      rightsProps: {
        children: 'child',
        label: 'rights_name'
      },
      defKeys: [],
      role_id: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('/rights/getRoleList')
      if (res.code !== 200) return this.$message.error('获取角色列表失败')
      this.rolelist = res.data
    },
    async deleteTag(rowid, itemid) {
      const confrimResult = await this.$confirm('确认删除该权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confrimResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete('/rights/deleteRightsRel', {
        params: {
          role_id: rowid.role_id,
          rights_id: itemid.rights_id
        }
      })
      if (res.code !== 200) return this.$message.error('删除权限失败')
      rowid.child = res.data[0].child
      // this.getRoleList()
    },
    async showSetRightsDialog(role) {
      // 获取所有权限数据
      this.role_id = role.role_id
      const { data: res } = await this.$http.get('/rights/getAllRightsTree')
      if (res.code !== 200) return this.$message.error('获取权限树出错')
      this.rightslist = res.data[0].child
      // 把所有三级角色编码存储起来
      this.getLeafKeys(role, this.defKeys)
      this.dialogVisible = true
    },
    getLeafKeys(node, arr) { // 递归函数获取所有三级权限
      if (!node.child) {
        return arr.push(node.rights_id)
      }
      node.child.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightsClose() {
      this.defKeys = []
    },
    async allowRights() {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post('/rights/allowRights', { ids: idStr, role_id: this.role_id })
      if (res.code !== 200) return this.$message.error('赋权失败')
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbuttom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  /*设置纵向剧中*/
  align-items: center;
}
</style>
