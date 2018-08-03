<template>
<Layout>
  <Row style="position: absolute;z-index: 1;">
    <Col :xs="0" :sm="0" :md="0">
    <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
      <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
        <MenuItem name="1-1">
        <Icon type="ios-navigate"></Icon>
        <span v-on:click="this.showmain">广场</span>
        </MenuItem>
        <MenuItem name="1-2">
        <Icon type="ios-navigate"></Icon>
        <span v-on:click="this.showhot">热度</span>
        </MenuItem>
        <MenuItem name="1-3">
        <Icon type="ios-navigate"></Icon>
        <span v-on:click="this.showme">关于我</span>
        </MenuItem>
      </Menu>
      <div slot="trigger"></div>
    </Sider>
    </Col>
  </Row>
  <Row :v-show="this.main">
    <Col :xs="0" :sm="0" :md="6">
    <Card>
      <p slot="title">
        <Avatar :src="$store.state.info.avatar"></Avatar>
        {{$store.state.info.name}}
      </p>
      <router-link slot="extra" to="/setting">
        <Icon type="ios-loop-strong"></Icon>
        设置
      </router-link>
      <table>
        <tr>
          <td>姓名</td>
          <td>{{$store.state.info.name}}</td>
        </tr>
        <tr>
          <td>昵称</td>
          <td>{{$store.state.info.nickname}}</td>
        </tr>
        <tr>
          <td>发消息数</td>
          <td>{{$store.state.info.messageCount}}</td>
        </tr>
        <tr>
          <td>获得的赞</td>
          <td>{{$store.state.info.beMarkCount}}</td>
        </tr>
        <tr>
          <td>获得的评论数</td>
          <td>{{$store.state.info.beCriticalCount}}</td>
        </tr>
      </table>
    </Card>
    <Button type="primary" @click="modal1 = true" long>发消息</Button>
    <router-link to="/ApplyOrganization" tag="span">
      <Button type="info" style="margin-top:1rem;" long>创建组织</Button>
    </router-link>
    </Col>
    <Col :xs="24" :sm="24" :md="12" class="center-container hide-parent">
    <Scroll class="hide-child" :on-reach-top="handleReachTop" :on-reach-bottom="handleReachBottom">
      <Button type="info" long style="margin-bottom:10px">刷新</Button>
      <Card v-for="item in list" class="card">
        <p slot="title">
          <Avatar :src="item.icon"></Avatar>{{item.nickname}}
        </p>
        <div slot="extra">
          <Button type="ghost" shape="circle" icon="heart" @click="like(item)">喜欢{{item.goodcount}}</Button>
          <Button type="error" shape="circle" icon="fireball" @click="report(item.messageid)">举报{{item.badcount}}
          </Button>
        </div>
        <Card>
          <div style="text-align:center">
            <h3 v-html="replaceContent(item.content)"></h3>
          </div>
        </Card>
        <Button shape="circle" type="ghost" @click="handleMoreClick(item)" long>更多</Button>
      </Card>
    </Scroll>
    </Col>
    <Col :xs="0" :sm="0" :md="6">
    <Card>
      <p slot="title">
        <Avatar>HOT</Avatar>最热消息
      </p>
      <ol style="margin: 0px 2rem;">
        <li v-for="(item,index) in hotInfo" :key="index" v-if="item"><a @click="handleMoreClick(item)">{{filterContent(item.content)}}</a>
        </li>
      </ol>
    </Card>
    <Card>
      <p slot="title">
        <Avatar>NEW</Avatar>最新评论
      </p>
      <ol style="margin: 0px 2rem;">
        <li v-for="(item, index) in comment_info" :key="index" v-if="item">{{item.content}}</li>
      </ol>
    </Card>
    </Col>
  </Row>
  <Modal v-model="modal1" title="发帖">
    <TextEdit></TextEdit>
    <div slot="footer">
    </div>
  </Modal>
  <Modal v-model="modal2">
    <MessageBox :post="item" :key="refreshid" :v-if="refreshif"></MessageBox>
    <div slot="footer">
      <Button type="ghost" long @click="modal2 = false">关闭</Button>
    </div>
  </Modal>
</Layout>
</template>
<script>
import TextEdit from '../textedit/TextEdit.vue';
import MessageBox from './MessageBox.vue';

export default {
  data() {
    return {
      main: true,
      hot: false,
      me: false,
      modal1: false,
      modal2: false,
      refreshid: 1,
      refreshif: true,
      item: [],
      items: [{
        username: 'tempuser'
      }],
      list2: [1],
      list1: [],
      hotInfo: [],
      comment_info: []
    }
  },
  methods: {
    showmain() {
      this.main = true;
      this.hot = false;
      this.me = false;
    },
    showhot() {
      this.main = false;
      this.hot = true;
      this.me = false;
    },
    showme() {
      this.main = false;
      this.hot = false;
      this.me = true;
    },
    getname(item) {
      if (!item) {
        console.log(item);
        return this.$store.getters.getnameById(item.sendid)
          .label;
      }
    },
    report(id) {
      this.$http.post("/api/v1/setMark", {
          messageid: id,
          type: 'bad',
          option: 1
        })
        .then(function(res) {
          res = res.body;
          if (res.count) {
            this.$Notice.warning({
              title: '成功',
              desc: '举报成功'
            });
          }
        })
    },
    like(item) {
      this.$http.post("/api/v1/setMark", {
          messageid: item.messageid,
          type: 'good',
          option: 1
        })
        .then(function(res) {
          res = res.body;
          if (res.count) {
            item.messageid = res.count;
            this.$Notice.success({
              title: '成功',
              desc: '点赞成功'
            });
          }
        })
    },
    changeLimit() {},
    handleReachTop() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.$http.get('/api/v1/getMessageById?id=0&type=0')
            .then(function(res) {
              this.list1 = res.body.info;
              this.$Message.success({
                content: '刷新成功',
                duration: 0.5,
                closable: true
              })
            }));
        }, 200);
      });
    },
    handleReachBottom() {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1];
          resolve(this.$http.get('/api/v1/getMessageById?type=0&id=' + last.messageid)
            .then(function(res) {
              if (res.body.code == 0) {
                res.body.info.forEach(e => {
                  this.list1.push(e);
                });
                this.$Message.success({
                  content: '刷新成功',
                  duration: 0.5,
                  closable: true
                })
              }
            }));
        }, 200);
      });
    },
    ok() {
      this.$Message.info('Clicked ok');
    },
    success() {
      this.$Message.success('This is a success tip');
    },
    handleMoreClick(item) {
      this.refreshid = this.refreshid + 1;
      this.refreshif = false;
      this.refreshif = true;
      this.item = item;
      this.modal2 = true;
    },
    filterContent(info) {
      info = info.replace(/@(.*?) /g, ' ');
      info = info.replace(/丨.*/g, ' ');
      return info
    },
    replaceContent(content) {
      let info = content.replace(/丨.*/g, ' ');
      this.$store.state.addressInfo.address.forEach(e => {
        let url = '#/user/' + e.value;
        info = info.replace('@' + e.value, '<a href=' + url + '>' + '@' + e.label + '</a>');
      });
      return info;
    },
  },
  mounted() {
    this.changeLimit();
    this.$http.get('/api/v1/getMessageById?id=0&type=0')
      .then(function(res) {
        this.list1 = res.body.info;
      });
    this.$http.get('/api/v1/getHotInfo')
      .then(function(res) {
        res = res.body;
        if (res.code == 0) {
          this.hotInfo = res.info;
        }
      });
    this.$http.get('/api/v1/getRecentCritical')
      .then((res) => {
        res = res.body;
        if (res.code == 0) {
          this.comment_info = res.info;
        }
      })
  },
  computed: {
    list() {
      return this.list1;
    }
  },
  components: {
    TextEdit,
    MessageBox
  }
}
</script>

<style scoped>
.card {
  width: 100%;
}

.ivu-card-head p,
.ivu-card-head-inner {
  height: auto;
}
</style>

<style media="screen">
.center-container {
  padding: 0px 1rem;
}

.hide-parent {
  overflow: hidden;
}

.ivu-card-bordered {
  margin-bottom: 1rem;
}

.hide-child {
  right: -30px;
}

.ivu-scroll-container {
  height: 80vh !important;
}

.ivu-scroll-content {
  padding-right: 3rem;
}

.ivu-scroll-loader-wrapper {
  margin-right: 3rem;
}

.ivu-avatar {
  margin-right: 0.5rem;
}
</style>
