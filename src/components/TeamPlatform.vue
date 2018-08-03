<template>
  <div>
    <div style="background:#eee;padding: 20px">
      <router-link :to="{ name: 'user', params: { userId: 123 }}">
        <Card :bordered="false">
          <p slot="title">No border title</p>
          <div  slot="extra"> <Avatar icon="person"/></div>
          <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
      </router-link>
    </div>
    <div style="background:#eee;padding: 20px">
      <Card :bordered="false">
        <div slot="title"><Avatar icon="person"/><span>No border title</span></div>
        <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
      </Card>
    </div>
    <div style="background:#eee;padding: 20px">
      <Card :bordered="false">
        <p slot="title">No border title</p>
        <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
      </Card>
    </div>
    <div style="background:#eee;padding: 20px">
      <Card :bordered="false">
        <p slot="title">No border title</p>
        <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
      </Card>
    </div>
    <div style="background:#eee;padding: 20px">
      <Card :bordered="false">
        <p slot="title">No border title</p>
        <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
      </Card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "team-platform"
  }
</script>

<style scoped>

</style>
