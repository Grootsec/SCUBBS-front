<template>
  <div class="dialog">
    <div class="loginPage">
      <h1>SCUCC登录</h1>
      <el-form>
        <el-form-item label="学号">
          <el-input type="text" id="user" v-model="formName.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" id="password" v-model="formName.password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        formName: {//表单中的参数
          user: '',
          userError: '',
          password: '',
          passwordError: '',
          beDisabled: true
        },
      }
    },
    methods: {
      submitForm(){
        this.$http.post('/api/v1/login',{zjh: this.formName.user, mm: this.formName.password}).then(function(responce){
          console.log(responce);
          responce = responce.body;
        // todo: $store 存储内容
          if (responce.code==0){
            this.$Message.success({
              content: "登录成功",
              duration: 0.3,
              closable: true
            });
            this.$store.commit("login", responce);
            this.$router.push('/');
          }
          else{
            // error parse
            this.$Message.error({
              content: '账号或密码错误',
              duration: 5,
              closable: true
            });
          }
        })
      },
      checkForm(){

      },
      resetForm(){
        this.formName.user = '';
        this.formName.password=''
      }
    },
    // mounted(){ }
  }
</script>

<style scoped>
  html,body{
    margin: 0;
    padding: 0;
    position: relative;
  }
  .dialog{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.8);
    text-align: center;
  }
  .loginPage{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -175px;
    width: 350px;
    min-height: 300px;
    padding: 30px 20px 20px;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .loginPage p{
    color: red;
    text-align: left;
  }
</style>
