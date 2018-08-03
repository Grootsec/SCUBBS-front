<template>
<div>
  <headers></headers>
  <div class="layout">
    <Layout>
      <Content :style="{margin: '88px 70px 0', minHeight: '500px'}">
        <bbq></bbq>
      </Content>
    </Layout>
  </div>
  <ifooter></ifooter>
</div>
</template>
<script>
import headers from './header/headers'
import ifooter from './footer/ifooter'
import bbq from './shortMessageContainer/bbq'

export default {
  data() {
    return {}
  },
  components: {
    headers,
    ifooter,
    bbq
  }
}
</script>

<style scoped>

</style>
