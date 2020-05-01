<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form :model="loginform" label-width="0px" class="login_form" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginform.password" prefix-icon="el-icon-s-goods" type="password"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetingForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginform: {
        /***
         * 设置表单内文本框的双向绑定步骤：
         * 1.在表单el-form标签中使用:model绑定一个属性为loginform的对象
         * 2.在data数据中放置一个loginform对象
         * 3.在表单中的el-input 标签中使用v-model属性进行数据绑定
         *    v-model属性值最好写成loginform.username \ loginform.password形式进行绑定
         * 4.在data的对象中的loginform对象中进行设置数据绑定对象
         */
        username: 'huang',
        password: '12345666'
      },
      /***
       * 设置表单的校验规则步骤：
       * 1.在表单el-form标签中使用 :rules 绑定一个校验规则对象
       * 2.在数据对象中设置一个校验规则对象，名称与el-form标签中的名称一样
       * 3.在表单中文本框的el-form-item标签中使用prop属性设置规则对象的规则匹配名称
       * 4.在数据对象中绑定规则详情 username:[{规则1,规则2}]
       */
      loginFormRules: { // 表单的验证规则对象
        username: [ // 验证用户名是否合法
          { required: true, message: '请输入用户名', trigger: 'blur' }, // required -是否为必填项 message-不满足时候的提示符
          { min: 3, max: 10, message: '长度在3到10个字符内', trigger: 'blur' }
        ],
        password: [ // 验证密码是否合法
          { required: true, message: '请输入密码内容', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetingForm () {
      /***
       * 重置按钮实现步骤
       * 1.在表单对象el-form标签中添加ref属性 ref="属性值"
       * 2.在触发位置通过this.$refs.属性值 获取到表单对象
       * 3.通过表单对象调用resetFields重置表单数据
       */
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async isPass => {
        if (!isPass) return
        const { data: res } = await this.$http.post('login/checkLogin', this.loginform)
        if (res.code !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功！')
        window.sessionStorage.setItem('token', res.token)
        this.$router.push('/home')

        // isPass是指是否通过验证 --true /false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color:#2b4b6b;
  height:100%;
}
  .login_box{
    width:450px;
    height:300px;
    background-color:#FFF;
    border-radius:3px;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);

    .avatar_box{
      height:130px;
      width:130px;
      border:1px solid #eee;
      border-radius: 50%;
      padding:10px;
      box-shadow:0 0 10px #ddd;
      position:absolute;
      left:50%;
      transform:translate(-50%,-50%);
      background:#fff;
      img{
        width:100%;height:100%;
        border-radius:50%;
        background-color:#eee;
      }
    }
  }
  .btns{
    text-align: right;
  }
  .login_form{
    position:absolute;
    bottom:0;
    width:100%;
    padding:0 20px;
    box-sizing: border-box;
  }
</style>
