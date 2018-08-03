<template>
  <div>
    <headers></headers>
    <div class="layout">
      <Layout>
        <Content :style="{margin: '88px 70px 0', minHeight: '500px'}">
          <xbb></xbb>
        </Content>
      </Layout>
    </div>
    <ifooter></ifooter>
  </div>
</template>
<script>
  import headers from './header/headers'
  import ifooter from './footer/ifooter'
  import xbb from './shortMessageContainer/xbb'
  export default {
    data() {
      return {}
    },
    components: {
      headers,
      ifooter,
      xbb
    }
  }
</script>

<style scoped>

</style>
