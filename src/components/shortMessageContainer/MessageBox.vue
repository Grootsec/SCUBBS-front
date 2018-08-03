<template lang="html">
  <Card class="card">
    <p slot="title">
      <span v-if="post.sex==='男'">
      <Avatar icon="man"></Avatar>
      </span>
      <span  v-else-if="post.sex==='女'">
      <Avatar icon="woman"></Avatar>
      </span>
      <span v-else>
      <Avatar>U</Avatar>{{getname(post.sendid)}}
      </span>
    </p>
    <div slot="extra">
      <Button type="ghost" shape="circle" icon="heart" @click="like(post.messageid)">喜欢:{{post.goodcount}}</Button>
      <Button type="error" shape="circle" icon="fireball" @click="report(post.messageid)">举报:{{post.badcount}}</Button>
    </div>
    <Card class="card">
      <div>
        <p v-html="replaceContent(post.content)"></p>
      </div>
      <div class="demo-upload-list" v-for="item in img_list">
        <img :src="item">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
        </div>
      </div>
    </Card>
    <Input placeholder="评论" v-model="comment_content" long style="margin-bottom: 1rem;">
    <span slot="append">
        <Button @click="comment">发表</Button>
      </span>
    </Input>
    <Card v-for="item in itemttt" class="card">
      <p slot="extra" style="
    font-style: ITALIC;
    color: #b3b3b3;">{{item.time}}</p>
      <div>
        <router-link target="_blank" :to="{ name: 'person-info', params: { id: item.sendid }}">
          @{{item.link}}
        </router-link>
        : {{item.content}}
      </div>
    </Card>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </Card>
</template>

<script>
export default {
  watch: {
    post(newpost, oldpost) {
      if (newpost.messageid === oldpost.messageid) return;
      this.$http.get('/api/v1/getCritical?messageid=' + this.post.messageid)
        .then(res => {
          res = res.body;
          if (res.code == 0) {
            this.itemttt = [];
            res.info.forEach((e) => {
              e.link = this.$store.getters.getnameById(e.sendid)
                .label;
              this.itemttt.push(e);
            });
            console.log(this.itemttt);
          }
        });
      this.$forceUpdate();
    }
  },
  props: {
    post: {},
  },
  data() {
    return ({
      visible: false,
      comment_content: '',
      itemttt: [1]
    })
  },
  computed: {
    img_list() {
      return this.imgContent(this.post.content);
    },
  },
  mounted() {
    this.$http.get('/api/v1/getCritical?messageid=' + this.post.messageid)
      .then(res => {
        res = res.body;
        if (res.code == 0) {
          this.itemttt = [];
          res.info.forEach((e) => {
            e.link = this.$store.getters.getnameById(e.sendid)
              .label;
            this.itemttt.push(e);
          });
          console.log(this.itemttt);
        }
      })
  },
  methods: {
    getname(sendid) {
      return this.$store.getters.getnameById(sendid)
        .label;
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
            this.post.badcount = res.count;
            this.$Message.success({
              content: '举报成功',
              duration: 0.5,
              closable: true
            })
          } else {
            this.$Message.error({
              content: '举报失败',
              duration: 0.5,
              closable: true
            })
          }
        })
    },
    like(id) {
      this.$http.post("/api/v1/setMark", {
          messageid: id,
          type: 'good',
          option: 1
        })
        .then(function(res) {
          res = res.body;
          if (res.count) {
            this.post.goodcount = res.count;
            this.$Message.success({
              content: '点赞成功',
              duration: 0.5,
              closable: true
            })
          } else {
            this.$Message.error({
              content: '点赞失败',
              duration: 0.5,
              closable: true
            })
          }
        })
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    replaceContent(content) {
      let info = content.replace(/丨.*/g, ' ');
      this.$store.state.addressInfo.address.forEach(e => {
        let url = '#/user/' + e.value;
        info = info.replace('@' + e.value, '<a href=' + url + '>' + '@' + e.label + '</a>');
      });
      return info;
    },
    imgContent(content) {
      let info = content.split('丨')[1];
      console.log(info);
      if (info.indexOf("pic") === -1) {
        return [];
      }
      return info.trim()
        .split(' ');
    },
    comment() {
      this.itemttt.push({
        "time": '2018-03-24 05:13:46',
        "id": this.$store.state.info.no,
        "link": this.$store.state.info.name,
        "content": this.comment_content
      });
      this.$http.post('/api/v1/addCritical', {
          messageid: this.post.messageid,
          content: this.comment_content
        })
        .then(res => {
          res = res.body;
          if (res.code == 0) {
            this.$Notice.success({
              title: '成功',
              desc: '成功更新信息'
            });
          }
        })
    }
  }
}
</script>

<style lang="css">
  .card {
    width: 100%;
    margin-bottom: 1rem;
  }

  .ivu-card-head p,
  .ivu-card-head-inner {
    height: auto;
  }

  .float-left {
    float: right;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
