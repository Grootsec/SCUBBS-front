<template>
<Layout>
  <Row>
    <Col span="6">
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
    </Col>
    <Col span="12" class="center-container hide-parent">
    <Scroll class="hide-child" :on-reach-top="handleReachTop" :on-reach-bottom="handleReachBottom">
      <Button type="info" long style="margin-bottom:10px">刷新</Button>
      <Card v-for="item in list" class="card" :class="item.style">
        <p slot="title">
          <Avatar v-if="item.sex=='男'" icon="man"></Avatar>
          <Avatar v-if="item.sex=='女'" icon="woman"></Avatar>
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
    <Col span="6">
    <Card>
      <p slot="title">
        <Avatar>A</Avatar>
        最热消息
      </p>
      <ol style="margin: 0px 2rem;">
        <li v-for="(item,index) in hotInfo" :key="index" v-if="item"><a @click="handleMoreClick(item)">{{filterContent(item.content)}}</a>
        </li>
      </ol>
    </Card>
    <Card>
      <p slot="title">
        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg">A</Avatar>
        最热评论
      </p>
      <ol style="margin: 0px 2rem;">
        <li v-for="(item, index) in comment_info" :key="index" v-if="item">{{item.content}}</li>
      </ol>
    </Card>
    </Col>
  </Row>
  <Modal v-model="modal1" title="发帖">
    <TextEdit :single=false :disable=false :type="2"></TextEdit>
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
      modal1: false,
      modal2: false,
      refreshid: 1,
      refreshif: true,
      item: [],
      items: [{
        username: 'tempuser'
      }],
      list2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      list1: [],
      hotInfo: [],
      comment_info: []
    }
  },
  methods: {
    getStyle(list) {
      return list.map((e) => {
        if (e.sex == "男") {
          e.style = "boy-animation";
        } else {
          e.style = "girl-animation";
        }
        return e;
      });
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
          resolve(this.$http.get('/api/v1/getMessageById?id=0&type=2')
            .then(function(res) {
              this.list1 = this.getStyle(res.body.info);
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
          resolve(this.$http.get('/api/v1/getMessageById?type=2&id=' + last.messageid)
            .then(function(res) {
              if (res.body.code == 0) {
                this.getStyle(res.body.info)
                  .forEach(e => {
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
    this.$http.get('/api/v1/getMessageById?id=0&type=2')
      .then(function(res) {
        this.list1 = this.getStyle(res.body.info);
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
@keyframes boymove {
  0% {
    background-color: #9b9b9b;
  }
  50% {
    background-color: #fff;
  }
  100% {
    background-color: #9b9b9b;
  }
}

@keyframes girlmove {
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #ff8fdc;
  }
  100% {
    background-color: #fff;
  }
}

.boy-animation {
  animation: boymove 5s ease-in-out infinite;
  -webkit-animation: boymove 5s ease-in-out infinite;
  -moz-animation: boymove 5s ease-in-out infinite;
}

.girl-animation {
  animation: girlmove 5s ease-in-out infinite;
  -webkit-animation: girlmove 5s ease-in-out infinite;
  -moz-animation: girlmove 5s ease-in-out infinite;
}

.center-container {
  padding: 0px 1rem;
}

.card {
  width: 100%;
}

.ivu-card-bordered {
  margin-bottom: 1rem;
}

.ivu-card-head p,
.ivu-card-head-inner {
  height: auto;
}

.ivu-card-footer {}

.hide-parent {
  overflow: hidden;
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

<style scoped>
.card {
  width: 100%;
}

.ivu-card-head p,
.ivu-card-head-inner {
  height: auto;
}
</style>
