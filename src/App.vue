<template>
  <div id="app">
    <!-- <QqMessage/> -->
    <WebSocketTest/>
  </div>
</template>

<script>
import QqMessage from '@/components/QqMessage.vue'
import WebSocketTest from '@/components/WebSocketTest.vue'
export default {
  name: 'app'
  ,data: function(){
    return{
    }
  }
  ,methods: {
  }
  ,mounted: function(){

  }

  ,components: {
     QqMessage
     ,WebSocketTest
  }
  ,watch:{
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin: auto;
}
#qq-messages{
  margin: auto;
  max-width: 40rem;
  /* max-height: 80vh;
  overflow: auto; */
}
/* .qq-messages::-webkit-scrollbar {
        display: none;
} */
.messages-group{
  margin: auto;
  max-width: 40rem;
  max-height: 50vh;
  overflow: auto;
}
.messages-group::-webkit-scrollbar {
  display: none;
}
.qq-content{
  text-align: right;
}
.input-content{
  color: red;
}
.input-btns{
  float: right;
}
.my-github{
  float: right;
}
</style>
