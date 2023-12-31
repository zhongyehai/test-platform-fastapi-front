<template>
  <div class="login-container login-wrap">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">{{ platformName }}</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.account"
          placeholder="账号"
          name="account"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :disabled="loginButtonIsDisabled"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>

      <!--      <div class="tips">-->
      <!--        <span style="margin-right:20px;">username: admin</span>-->
      <!--        <span> password: any</span>-->
      <!--      </div>-->

    </el-form>

    <!-- 修改密码框 -->
    <el-dialog :title="'修改密码'" :modle="tempPassword" :visible.sync="change_password_dialog_is_show">

      <el-form ref="dataForm" label-position="left" label-width="70px" style="min-width: 400px;">
        <el-form-item :label="'旧密码'" prop="name" class="filter-item" style="background-color: white" size="mini">
          <el-input v-model="tempPassword.old_password" />
        </el-form-item>
        <el-form-item :label="'新密码'" prop="name" class="filter-item" style="background-color: white" size="mini">
          <el-input v-model="tempPassword.new_password" />
        </el-form-item>
        <el-form-item :label="'确认密码'" prop="name" class="filter-item" style="background-color: white" size="mini">
          <el-input v-model="tempPassword.sure_password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button size="mini" @click="change_password_dialog_is_show = false"> {{ '取消' }}</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="change_password_button_is_loading"
          @click="change_password"
        > {{ '确定' }}
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import * as types from '@/store/types'
import { validUsername } from '@/utils/validate'
import { ChangeMigrateUserPassword, login } from '@/apis/system/user'
import { getConfigByCode } from '@/apis/config/config'

export default {
  name: 'Login',
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码不小于4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateAccount }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },

      loginButtonIsDisabled: false,
      passwordType: 'password',
      redirect: undefined,
      platformName: null,

      change_password_dialog_is_show: false,
      change_password_button_is_loading: false,
      // 密码修改临时表单
      tempPassword: {
        old_password: '',
        new_password: '',
        sure_password: ''
      }
    }
  },

  mounted() {
    // 请求测试平台名字
    getConfigByCode({ code: 'platform_name' }).then(response => {
      this.platformName = response.data
      document.title = this.platformName
      localStorage.setItem('platformName', this.platformName)
    })

    // 用户名和密码输入框都为空的时候，自动聚焦到用户名输入框
    if (this.loginForm.username === '' && this.loginForm.password === '') {
      this.$refs.username.focus()
    }
  },

  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },

  methods: {

    // 点击展示密码按钮，通过控制passwordType属性控制展示/隐藏密码
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    // 调登录接口
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginButtonIsDisabled = true
          login({ 'account': this.loginForm.account, 'password': this.loginForm.password }).then((response) => {
            this.loginButtonIsDisabled = false
            if (this.showMessage(this, response)) {
              // 存储状态
              this.$busEvents.data.permissions = response.data.front_permissions
              this.$store.commit(types.token, response.data.token)
              this.$store.commit(types.userName, response.data.name)
              localStorage.setItem('id', response.data.id)
              localStorage.setItem('permissions', JSON.stringify(response.data.front_permissions))
              localStorage.setItem('business', JSON.stringify(response.data.business_list))
              // 重定向到指定路由
              const redirect = this.$route.query.redirect || '/'
              this.$router.push({ path: redirect }) // 重定向到指定路由
              // this.$router.push({path: redirect.slice(redirect.indexOf('=') + 1)})  // 重定向到指定路由
            } else {
              if (response.message === '需要修改密码') {
                this.tempPassword.old_password = ''
                this.tempPassword.new_password = ''
                this.tempPassword.sure_password = ''
                this.change_password_button_is_loading = false
                this.change_password_dialog_is_show = true
              }
            }
          })
        } else {
          this.$message.error('数据校验不通过，请确认')
        }
      })
    },

    // 提交修改密码
    change_password() {
      this.change_password_button_is_loading = true

      ChangeMigrateUserPassword(
        {
          account: this.loginForm.account,
          old_password: this.tempPassword.old_password,
          new_password: this.tempPassword.new_password,
          sure_password: this.tempPassword.sure_password
        }).then(response => {
        this.change_password_button_is_loading = false
        if (this.showMessage(this, response)) {
          // 自动登录
          this.loginForm.password = this.tempPassword.new_password
          this.handleLogin()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../../assets/loginBackground.jpg);
  background-size: 100%;
}

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #454545;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
