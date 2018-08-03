<template>
<div class="layout">
  <headers></headers>
  <BackTop></BackTop>
  <Layout>
    <Content :style="{margin: '88px 70px 0', minHeight: '500px'}">
      <div>
        <Row :gutter="16">
          <Col span="8">
          <Card class="tranCrad">
            <p slot="title">
              <Avatar size="large" :src="avatar"></Avatar>
              <span v-if="!showEdit">{{username}}</span>
              <span v-if="showEdit">
                <Input v-model="username" placeholder="请输入昵称" style="width: auto"></Input>
              </span>
            </p>
            <div slot="extra">
              <a href="#" @click.prevent="changeInfo">
                <Icon type="edit"></Icon>
                修改
              </a>
            </div>
            <Card>
              <table>
                <tr>
                  <td>姓名</td>
                  <td>{{name}}</td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>{{sex}}</td>
                </tr>
                <tr>
                  <td>年级</td>
                  <td>{{grade}}</td>
                </tr>
                <tr>
                  <td>学院</td>
                  <td>{{college}}</td>
                </tr>
                <tr>
                  <td>专业</td>
                  <td>{{profession}}</td>
                </tr>
                <tr>
                  <td>点赞</td>
                  <td>{{vote}} 次</td>
                </tr>
              </table>
            </Card>
            <Card style="margin-top: 0.5rem;">
              <p v-if="!showEdit" style="text-align: center;">{{introduction}}</p>
              <Input v-if="showEdit" v-model="introduction" type="textarea" :autosize="{minRows: 2}" placeholder="请输入您的简介"></Input>
            </Card>
            <div style="margin-top: 0.5rem;" v-if="showEdit">
              <Button type="primary" shape="circle" long @click.prevent="handleSubmit">确定</Button>
            </div>
            <Upload v-if="showEdit" style="margin-top: 1rem;" multiple type="drag" action="/api/v1/im/avatarupload" :on-success="handleSuccess" :format="['jpg','jpeg','png','gif']" :max-size="2048" :on-format-error="handleFormatError">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击选择或拖入您的头像</p>
              </div>
            </Upload>
          </Card>
          <div style="border-style: dashed;border-width: 1px;height: 1px;width: 100%;margin-top: 1rem;margin-bottom: 1rem;"></div>
          <Card class="tranCrad">
            <p slot="title">
              我的组织
            </p>
            <Card v-for="team in teams" style="margin-bottom: 0.5rem;">
              <p slot="title">
                <Avatar size="large" :src="team.avatar"></Avatar>
                {{team.teamname}}
              </p>
              <a :href="team.link" slot="extra" target="_blank">
                <Icon type="forward"></Icon>
                查看
              </a>
              <p style="text-align: center;">{{team.info}}</p>
            </Card>
          </Card>
          </Col>
          <Col span="16">
          <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              时间线
            </p>
            <timeline-bur>
              <timeline-item-bur :date="item.date" v-for="item of items" type="primary">
                <!-- <p>{{filterContent(item.content)}}</p> -->
                <p>
                  <span>{{item.contentType}}</span><span v-html="item.content" class="postinfo"></span>
                </p>
              </timeline-item-bur>
            </timeline-bur>
          </Card>
          </Col>
        </Row>
      </div>
    </Content>
  </Layout>
  <ifooter></ifooter>
</div>
</template>

<script>
import headers from "./header/headers"
import ifooter from './footer/ifooter'

export default {
  name: "person-info",
  data() {
    return {
      mynumber: this.$store.state.info.no,
      showEdit: false,
      name: "",
      username: "",
      nickname: "",
      college: "",
      avatar: "",
      introduction: "",
      profession: "",
      grade: "",
      sex: "",
      vote: "",
      items: [],
      teams: [],
      file: {
        url: ''
      }
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
    handleFormatError() {
      this.$Notice.success({
        title: '文件格式错误',
        desc: '仅支持图像文件格式'
      });
    },
    handleSuccess(res, file) {
      this.file.url = res.thumbnailpath;
      this.file.name = res.filepath;
      this.$http.post("/api/v1/updateIcon", {
          id: this.$store.state.info.no,
          icon: this.file.url
        })
        .then((res) => {
          this.$Notice.success({
            title: '成功',
            desc: '上传头像成功'
          });
        });
    },
    changeInfo() {
      this.showEdit = true;
    },
    handleSubmit() {
      this.$http.post("/api/v1/updateObject", {
          id: this.$store.state.info.no,
          name: this.username,
          icon: this.file.url,
          description: this.introduction
        })
        .then(function(res) {
          this.$Notice.success({
            title: '成功',
            desc: '成功更新信息'
          });
          this.showEdit = false;
          this.getUserInfo();
        })
    },
    getUserInfo() {
      this.$http.get('/api/v1/getuserinfo' + "?id=" + this.mynumber)
        .then(function(res) {
          res = res.body;
          this.username = res.nickname;
          this.avatar = res.avatar;
          this.introduction = res.introduction;
          this.college = res.academy;
          this.sex = res.sex;
          this.grade = res.grade;
          this.profession = res.profession;
          this.name = res.name;
          this.items = [];
          if (res.message) {
            res.message.forEach((e) => {
              let msg = e.content.split("丨")[0];
              this.$store.state.addressInfo.address.forEach((person) => {
                msg = msg.replace('@' + person.value, '<a href="/#/user/' + person.value + '" target="_blank">@' + person.label + '</a>');
              });
              this.items.push({
                "date": e.time,
                "content": msg,
                "contentType": '发消息: '
              });
            });
          };
          this.vote = res.mark.length - res.mark.filter((e) => {
              if (e.type == 'good') {
                return e;
              }
            })
            .length;
        });
      this.$http.get('/api/v1/getTeamInfo' + '?studentnumber=' + this.mynumber)
        .then((res) => {
          res = res.body;
          if (res.info) {
            this.teams = [];
            res.info.forEach((e) => {
              let team = {
                "teamname": e.name,
                "avatar": e.icon,
                "info": e.description,
                "link": '/#/organization/' + e.id
              };
              this.teams.push(team);
            });
          }
        });
    },
    filterContent(info) {
      info = info.replace(/@(.*?) /g, ' ');
      info = info.replace(/丨.*/g, ' ');
      return info
    }
  }
}
</script>

<style>
.ivu-card-head {
  background-color: #fff;
}

.tranCrad {
  background-color: rgba(0, 0, 0, 0);
}

.ivu-card-head p,
.ivu-card-head-inner {
  height: auto;
}

.postinfo {
  font-style: italic;
  color: #b7b7b7;
}
</style>
