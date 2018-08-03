<template>
  <div>
    <div style="background:#eee;padding: 20px" v-for="item of team_list" :key="item.id">
      <router-link :to="{ name: 'organization', params: { id: item.id }}">
      <Card :bordered="false">
        <p slot="title">{{item.name}}</p>
        <div  slot="extra"> <Avatar :src="item.icon" v-if="item.icon"></Avatar><Avatar icon="person" v-else="item.icon" /></div>
        <p>{{item.description}}</p>
      </Card>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "team-platform",
    data(){
      return {
        team_list: [{"name":"四川大学网络空间安全协会","description":"四川大学最菜的协会","icon":"","id":"T1"},{"name":"四川大学网络空间安全协会","description":"四川大学最菜的协会","icon":"","id":"T2"}],
      }
    },
    created(){
      this.$http.get("/api/v1/getAllTeamInfo").then(function(res){
        res = res.body.info;
        this.team_list = res;
      })
    }
  }
</script>

<style scoped>

</style>
