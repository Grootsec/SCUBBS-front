<template>
  <div>
    <headers></headers>
    <div class="layout">
      <Layout>
        <Content :style="{margin: '88px 70px 0', minHeight: '500px'}">
          <Card>
            <div>
              <Row type="flex" justify="center" class="code-row-bg">
                <Col span="4">
                <label> 组织名称&nbsp;&nbsp;&nbsp;</label></Col>
                <Col span="4">
                <Input v-model="OrganizationName" placeholder="Enter something..." clearable
                       style="width: 200px"></Input>
                </Col>
              </Row>
            </div>
            <Row type="flex" justify="center" class="code-row-bg">
              <Col span="4">
              <label> 组织描述</label></Col>
              <Col span="4">
              <Input v-model="description" placeholder="Enter something..." clearable style="width: 200px"></Input>
              </Col>
            </Row>
            <Row type="flex" justify="center" class="code-row-bg">
              <Col span="4">
              <Button type="success" size="large" style="width: 80%" v-on:click="submit">申请</Button>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
      <ifooter></ifooter>
    </div>
  </div>
</template>
<script>
  import headers from './header/headers'
  import ifooter from './footer/ifooter'

  export default {
    data() {
      return {
        OrganizationName: '',
        OrganizationHeadName: '',
        College: '',
        description: ''
      }
    },
    methods: {
      submit() {
        // todo: 加入后台接口
        this.$http.post('/api/v1/createTeam', {
          name: this.OrganizationName,
          description: this.description
        })
          .then(function (res) {
            res = res.body;
            if (res.code == 0) {
            this.$Message.success({
              content: '申请成功',
              duration: 0.5,
              closable: true
            });
            // this.$router.push("/");
            } else {
            this.$Message.error({
              content: '未知错误',
              duration: 0.5,
              closable: true
            });
          }
        });

      }
    },
    components: {
      headers
    }
  }
</script>


<style scoped>
  label {
    text-align: center;
    font-size: 20px;
  }
</style>
