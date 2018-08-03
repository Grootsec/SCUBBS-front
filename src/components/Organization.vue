<template>
<div>
  <headers></headers>
  <BackTop></BackTop>
  <Layout>
    <Content :style="{margin: '88px 70px 0', minHeight: '500px'}">
      <Card class="card">
        <p slot="title">
          <Avatar size="large" :src="avatar"></Avatar>
          {{username}}
        </p>
        <div style="text-align:center">
          <p>{{introduction}}</p>
          <!-- <div style="border-style: dashed;border-width: 1px;height: 1px;width: 100%;margin-top: 1rem;margin-bottom: 1rem;"></div>
          <h3 style="font-weight: bold;">组织人数: {{count}}</h3> -->
          <Button type="success" @click="apply" long>申请加入</Button>
        </div>
      </Card>
    </Content>
  </Layout>
  <ifooter></ifooter>
</div>
</template>

<script>
import headers from "./header/headers"
import ifooter from './footer/ifooter'

export default {
  name: "organization",
  data() {
    return {
      username: "",
      avatar: "",
      count: "",
      introduction: "",
      new_secret_message: [],
      new_dynamic: [{
        "date": "2分钟前",
        "content": "逼王真是强"
      }, {
        "date": "2分钟前",
        "content": "逼王真是强"
      }, {
        "date": "1996/1/2",
        "content": "逼王诞生于云南"
      }, {
        "date": "2分钟前",
        "content": "逼王真是强"
      }]
    }
  },
  components: {
    headers,
    ifooter
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      console.log(this.$route);
      let id = this.$route.params.id;
      this.$http.get('/api/v1/getTeamInfoByNumber' + "?id=" + id)
        .then(function(res) {
          res = res.body;
          if (res.code == 0) {
            res = res.info;
            this.username = res.name;
            this.avatar = res.icon;
            this.introduction = res.description;
          }

        })
    },
    apply() {
      let id = this.$route.params.id;
      this.$http.post('/api/v1/applyTeam', {
          teamid: id
        })
        .then(function(res) {
          if (res.code == 0) {
            this.$Message.success({
              content: "申请成功",
              duration: 0.3,
              closable: true
            });
          } else {
            this.$Message.success({
              content: "您已经是该组织的成员了",
              duration: 0.8,
              closable: true
            });
          }
        })

    }
  }
}
</script>

<style scoped>
.card {
  margin: auto;
  width: 40vw;
}

.ivu-card-head p,
.ivu-card-head-inner {
  height: auto;
}

.ivu-avatar {
  margin-right: 0.5rem;
}
</style>
