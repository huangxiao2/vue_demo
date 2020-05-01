<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.menu_id" v-for="item in menuList" :key="item.menu_id">
            <template slot="title">
              <i :class="iconsObj[item.menu_id]"></i>
              <span>{{item.menu_name}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.target_path" v-for="subItem in item.children" :key="subItem.menu_id" @click="saveNavState('/'+subItem.target_path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.menu_name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
<!--        放置路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        1001: 'el-icon-s-custom',
        1002: 'el-icon-s-goods',
        1003: 'el-icon-s-shop',
        1004: 'el-icon-s-platform',
        1005: 'el-icon-s-cooperation'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      // 跳转在登陆页面
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('/menu/getMenu')
      console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.menuList = res.list
    },
    toggleCollpase () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{width:100%;height:100%;}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #FFF;
  > div{
    display:flex;
    align-items: center
  }
  img{
    height:60px;
    margin-right: 15px
  }
}
.el-aside{
  background-color: #333744;
  .el-menu {
    border-right:none;
  }
  i{
    margin-right: 10px;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.toggle-button{
  background-color: #4A5064;
  font-size:10px;
  line-height: 24px;
  color: #ffffff;
  text-align:center;
  letter-spacing:0.2em;
  cursor:pointer;
}
</style>
