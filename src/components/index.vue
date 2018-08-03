<template>
<div>
  <headers></headers>
  <div class="layout">
    <Layout>
      <Content :style="{minHeight: '500px'}" class="layoutC layoutM">
        <shortMessage></shortMessage>
      </Content>
    </Layout>
  </div>
  <ifooter></ifooter>
</div>
</template>
<script>
import headers from './header/headers'
import ifooter from './footer/ifooter'
import shortMessage from './shortMessageContainer/shortMessage'
export default {
  data() {
    return {

    }
  },
  components: {
    headers,
    ifooter,
    shortMessage
  }
}
</script>

<style scoped>
@media (min-width: 600px) {
  .layoutC {
    margin-left: 70px;
    margin-right: 70px;
  }
}

.layoutM {
  margin-top: 88px;
}
</style>
