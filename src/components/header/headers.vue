<template>
<div class="layout">
  <Layout>
    <Header :style="{position: 'fixed', width: '100%', zIndex: '1'}" class="ivu-layout-header-m">
      <Menu mode="horizontal" :theme="theme1" active-name="1">
        <div class="layout-nav">
          <Row>
            <Col :xs="24" :md="0">
            <Submenu name="5">
              <template slot="title">
                <span style="font-size: x-large;">SCUCC</span>
              </template>
              <router-link to="/" tag="span">
                <MenuItem name="3-1">青春广场</MenuItem>
              </router-link>
              <router-link to="/xbb" tag="span">
                <MenuItem name="3-2">瞎BB</MenuItem>
              </router-link>
              <router-link to="/bbq" tag="span">
                <MenuItem name="3-3">表白墙</MenuItem>
              </router-link>
            </Submenu>
            </Col>
            <Col :xs="0" :md="24">
            <MenuItem name="0">
            <router-link to="/SCUCC" tag="span">
              <h1>SCUCC</h1>
            </router-link>
            </MenuItem>
            <MenuItem name="1">
            <router-link to="/" tag="span">
              <Icon type="ios-paper"></Icon>青春广场
            </router-link>
            </MenuItem>
            <MenuItem name="2">
            <router-link to="/xbb" tag="span">
              <Icon type="ios-people"></Icon>瞎BB
            </router-link>
            </MenuItem>
            <MenuItem name="3">
            <router-link to="/bbq" tag="span">
              <Icon type="heart"></Icon>表白墙
            </router-link>
            </MenuItem>
            </Col>
          </Row>
        </div>
        <div class="float-left">
          <MenuItem name="4">
          <router-link to="/setting" style="color: rgba(255,255,255,.7);">
            <Badge :count="count" dot>
              <Avatar :src="avatar" v-if="avatar" />
              <Avatar icon="person" v-else="avatar" />
            </Badge>
          </router-link>
          <Dropdown>
            <span>
                <span v-if="nickname">{{$store.state.info.nickname}}</span>
            <span v-else="nickname">{{$store.state.info.name}}</span>
            <Icon type="arrow-down-b"></Icon>
            </span>
            <DropdownMenu slot="list" trigger="click">
              <router-link v-if="!show_login" to="/setting" tag="span">
                <DropdownItem>设置</DropdownItem>
              </router-link>
              <router-link v-if="show_login" to="/login" tag="span">
                <DropdownItem>login</DropdownItem>
              </router-link>
              <router-link v-else="show_login" to="/logout" tag="span">
                <DropdownItem>logout</DropdownItem>
              </router-link>
            </DropdownMenu>
          </Dropdown>
          </MenuItem>
        </div>
      </Menu>
    </Header>
  </Layout>
</div>
</template>

<script>
export default {
  data() {
    return {
      theme1: 'dark',
      name: this.$store.state.info.name,
      nickname: this.$store.state.info.nickname,
      show_login: false,
      count_temp: 0
    }
  },
  computed: {
    avatar: function() {
      return this.$store.state.info.avatar
    },
    count() {
      return this.count_temp;
    }
  },
  mounted() {
    if (document.cookie.indexOf("myStrCookie=") === -1) {
      this.show_login = true;
    } else {
      if (this.name === "登录") {
        this.$http.get("/api/v1/fetchInfo")
          .then(function(res) {
            res = res.body;
            if (res.code == 0) {
              this.$store.commit("fetch", res);
            } else {
              this.show_login = true;
            }
          })
      }
    }
    if (this.$store.state.addressInfo.address.length === 0) {
      this.$http.get("/api/v1/getAllNameAndNumber")
        .then(function(res) {
          res = res.body;
          this.$store.commit("fetchAddressInfo", res);
        })
    }
    this.$http.get('/api/v1/getAtNumber')
      .then(function(res) {
        this.count_temp = res.body.count;
      })
  }
};
</script>

<style scoped>
.float-left {
  position: relative;
  float: right;
}

.layout-nav {
  position: relative;
  float: left;
}

.ivu-menu.ivu-menu-dark.ivu-menu-horizontal {
  position: relative;
  overflow: hidden;
  width: 100%;
}

@media (max-width: 600px) {
  .ivu-layout-header-m {
    padding: 0 !important;
  }
}
</style>
