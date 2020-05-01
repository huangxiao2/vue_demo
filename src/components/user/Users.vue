<template>
  <div>
<!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.queryParam" clearable @clear="getUserLsit">
            <el-button slot="append" icon="el-icon-search" @click="getUserLsit"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

<!--      用户列表区-->
      <el-table :data="userlist" border stripe>
<!--        增加索引列 type=index-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="user_name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="user_status">
<!--          设置作用域插槽，使用scope接收当前行所有数据-->
          <template slot-scope="scope">
            <el-switch v-model=scope.row.user_status @change="changeUserStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px;">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserMsg(scope.row.user_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.user_id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

<!--      分页区域-->
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='queryInfo.pageNum'
        :page-sizes='[1, 2, 5, 10]'
        :page-size='queryInfo.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%" @close="addDialogClose">
<!--      内容主体区域-->
      <el-form :model="addFrom" label-width="70px" :rules="addFromRules" ref="addFromRef">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="addFrom.phone"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%"  @close="editDialogClose">
      <!--      内容主体区域-->
      <el-form :model="editForm" label-width="70px" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色"
      :visible.sync="showDialogVisible"
      width="50%">
      <p>用户名：{{userInfo.user_name}}</p>
      <p>角色名：{{userInfo.role_name}}</p>
      <p>分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolelist"
            :key="item.value"
            :label="item.role_name"
            :value="item.role_id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmUserRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    /***
     * 使用自定义校验文本框内容
     * 步骤：
     * 1.自定义校验方法
     * 2.在Rule对象中指定的位置调用
     *    使用validator ：自定义校验方法
     */
    // 自定义校验规则
    var checkEmail = (rule, value, cb) => {
      // 使用正则表达式校验
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    var checkPhone = (rule, value, cb) => {
      // 使用正则表达式校验
      const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      selectedRoleId: '',
      rolelist: [],
      queryInfo: {
        queryParam: '',
        pageNum: 1,
        pageSize: 10
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addFrom: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      editDialogVisible: false,
      editForm: {
        user_id: '',
        username: '111',
        phone: '',
        email: ''
      },
      editFormRules: {
        email: [ // 验证邮箱
          { required: true, message: '请输入邮箱内容', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符内', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [ // 验证手机号
          { required: true, message: '请输入手机号内容', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到11个字符内', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editFormRef: {},
      addFromRef: {},
      addFromRules: {
        username: [ // 验证用户名是否合法
          { required: true, message: '请输入用户名', trigger: 'blur' }, // required -是否为必填项 message-不满足时候的提示符
          { min: 3, max: 10, message: '长度在3到10个字符内', trigger: 'blur' }
        ],
        password: [ // 验证密码是否合法
          { required: true, message: '请输入密码内容', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符内', trigger: 'blur' }
        ],
        email: [ // 验证邮箱
          { required: true, message: '请输入邮箱内容', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符内', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [ // 验证手机号
          { required: true, message: '请输入手机号内容', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到11个字符内', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      showDialogVisible: false,
      userInfo: {}
    }
  },
  created() {
    this.getUserLsit()
  },
  methods: {
    async confirmUserRole() {
      if (!this.selectedRoleId) this.$message.error('请选择新角色')
      const { data: res } = await this.$http.post('/rights/allowUserRole', { role_id: this.selectedRoleId, user_id: this.userInfo.user_id })
      if (res.code !== 200) return this.$message.error('用户赋角色失败')
      this.$message.success('赋角色成功')
      this.getUserLsit()
      this.showDialogVisible = false
    },
    async showDialog(user) {
      this.showDialogVisible = true
      this.userInfo = user
      const { data: res } = await this.$http.get('/rights/getRoleList')
      if (res.code !== 200) return this.$message.error('获取角色列表失败')
      this.rolelist = res.data
    },
    async getUserLsit() {
      const { data: res } = await this.$http.get('/users/users', {
        params: this.queryInfo
      })
      if (res.code !== 200) return this.$message.error('获取用户列表失败')
      for (var i = 0; i < res.list.length; i++) {
        res.list[i].user_status = res.list[i].user_status === 'true'
      }
      this.userlist = res.list
      this.total = res.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pageSize = newsize
      this.getUserLsit()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserLsit()
    },
    async changeUserStatus(param) {
      const { data: res } = await this.$http.put('users/updateUserStatus', {
        user_id: param.user_id,
        user_status: param.user_status ? '1' : '0'
      })
      if (res.code !== 200) {
        param.user_status = !param.user_status
        return this.$message.error('修改失败')
      }
      this.$message.success('修改状态成功')
    },
    addDialogClose() {
      this.$refs.addFromRef.resetFields()
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      // 表单的预校验
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users/addUser', this.addFrom)
        if (res.code !== 200) return this.$message.error('添加失败')
        this.dialogVisible = false
        this.getUserLsit()
        this.$message.success('添加用户成功')
      })
    },
    async editUserMsg(id) {
      const { data: res } = await this.$http.get('/users/queryUserById', {
        params: {
          user_id: id
        }
      })
      if (res.code !== 200) return this.$message.error('查询用户信息失败')
      this.editDialogVisible = true
      this.editForm.username = res.data.user_name
      this.editForm.phone = res.data.phone
      this.editForm.email = res.data.email
      this.editForm.user_id = id
    },
    updateUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/users/updateUserMsg', this.editForm)
        if (res.code !== 200) return this.$message.error('修改用户信息失败')
        this.editDialogVisible = false
        this.getUserLsit()
        this.$message.success('修改用户信息成功')
      })
    },
    async deleteUser(id) {
      const resultMsg = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (resultMsg !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete('/users/deleteUser', {
        params: {
          user_id: id
        }
      })
      if (res.code !== 200) return this.$message.error('删除用户失败')
      this.getUserLsit()
      this.$message.success('删除用户成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
