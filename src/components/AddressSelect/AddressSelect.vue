<!--通讯录选择器-->
<template>
  <div>
    <p>通讯录</p>
    <Select v-model="address_copy" @input="submit" filterable>
      <Option v-for="item in addresslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>

<script>
  export default {
    props: {
      address: "",
      addresslist: {
        default: [{
          value: 'New York',
          label: 'New York'
        },]
      },
    },
    name: "address-select",
    data(){
      return {
        address_copy : this.address
      }
    },
    methods:{
      submit(event){
        this.$emit('ontest', this.address_copy);
      }
    }
  }
</script>

<style scoped>

</style>
