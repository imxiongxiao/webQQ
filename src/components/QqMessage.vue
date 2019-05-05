<template>
  <div id="qq-message">
    <a class="my-github" :href="showGithubUrl" v-if="showGithub"><img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></a>
    <b-card
      id="qq-messages"
      :header="currentTitle"
      >
      <div class="messages-group">
        <b-card 
          class="qq-message"
          v-for="(item,index) in currentData" :key="index" :title="item.qq">
          <b-card-text class="qq-content">{{ item.content }}</b-card-text>
        </b-card>
      </div>
      <br/>
      <div class="message-input">
        <b-textarea class="input-content" v-model="inputContent" @keyup.ctrl.enter="sendMessage" >
        </b-textarea>
        <br/>
        <b-form-select
          class="mb-2 mr-sm-2 mb-sm-0 col-md-2"
          size="sm"
          v-model="currentIndex"
        >
        <option v-for="(item,index) in qqs" :key="index" :value="index"  v-b-tooltip.hover title="Tooltip content">{{item.qqname}}</option>
        </b-form-select>
        <b-button-group class="input-btns">
          <b-button variant="info" @click="clearMessage">清空</b-button>
          <b-button  variant="success" @click="sendMessage" >发送</b-button>
          <b-button variant="info" @click="showDesc">点我</b-button>
        </b-button-group>

      </div>
    </b-card>
  </div>
</template>

<script>
// import QqMessage from '@/components/QqMessage.vue'

export default {
  name: 'QqMessage'
  ,data: function(){
    return{
      imgUrl:{
        click: require('@/assets/click20x11.jpg')
      }
      ,inputContent:"内容"
      ,pathLocal:"ws://localhost:49632/"
      ,path: ""
      ,qqs: []  // qq 和群 汇集
      ,qqsMsgs:[]   // qq消息汇总
      ,currentData: ""
      ,currentIndex: ""
      ,currentTitle: ""
      ,showGithub: true
      ,showGithubUrl: "" //显示Url
    }
  }
  ,methods: {
    initData(data){
        this.qqs = data.qqs        // 获取qq号 群    
        for(var i=0;i<this.qqs.length;i++){
                this.qqsMsgs[i] = [] //初始化
        }
        if(this.qqs.length>0){
          this.currentIndex = 0   
          this.currentTitle = this.qqs[this.currentIndex].qqname
        }else {
          alert("没有添加任何群")
          return
        }
        this.showGithubUrl = data.showDev.devUrl
        // alert(this.showGithubUrl)
        var showGithub = localStorage.getItem('showGithub')
        if(showGithub){
          this.showGithub = false
        }else{
          localStorage.setItem('showGithub', true)
        }
        this.path = data.path
    }
    ,init: function () {
        if(typeof(WebSocket) === "undefined"){
            alert("您的浏览器不支持socket")
        }else{
            // 实例化socket
            this.socket = new WebSocket(this.path)
            // 监听socket连接
            this.socket.onopen = this.open
            // 监听socket错误信息
            this.socket.onerror = this.error
            // 监听socket消息
            this.socket.onmessage = this.onMessage
        }
    }
    ,open: function () {
        console.log("socket连接成功")
    }
    ,error: function () {
        // console.log("连接错误")
    }
    ,onMessage: function (msg) {
        console.log(msg.data)
        var data =  JSON.parse(msg.data) //JSON.parse(JSON.stringify(msg.data))
        if(typeof data.id ==="string"){
          //alert("是数字")  // 回应
          return 
        }
        // console.log("typeof ", typeof data.id)
        if(data.event == "message" && data.params.group !== ""){
          this.addMsgs(data.params,1)
        }else if(data.event == "message" && data.params.qq !== ""){
          this.addMsgs(data.params,2)
        }
        this.chooseWhow()
    }
    ,close: function () {
        console.log("socket已经关闭")
    }
    ,chooseWhow(){
        this.currentData = this.qqsMsgs[this.currentIndex] 
    }
    ,getNickname(qq){
      var qqNack = JSON.stringify({method:"getNickname",id:Math.floor(Math.random()*100),params:{qq}})
      console.log("getQQ",qqNack)
      this.socket.send(qqNack)
    }
    ,addMsgs(data, index){
      // console.log("addDta:",data,index)
      var i
      if(index === 1){ // 是群
        for(i = 0;i<this.qqs.length;i++){
          if(data.group === this.qqs[i].qq){
            // console.log("获得：",data,this.qqs[i].qqname)
            this.qqsMsgs[i].push(data) // 加入群
            break
          }
        }
      }else if(index === 2){  //是QQ
        for(i = 0;i<this.qqs.length;i++){
          if(data.qq === this.qqs[i].qq){
            this.qqsMsgs[i].push(data) // 加入qq
            break
          }
        }
      }
      this.getNickname(data.qq)
    }
    ,sendGroup: function (qq, content) {
        // this.socket.send(JSON.stringify(this.getMsg))
        var sendString = this.sendData(2, qq,'', content)
        this.socket.send(JSON.stringify(sendString))
    }
    ,sendQQ(qq, content){
      var sendString = this.sendData(1,'', qq, content)
      // console.log("data:",JSON.stringify(sendString))
      this.socket.send(JSON.stringify(sendString))
    }
    ,sendMessage(){
      //alert(this.inputContent)
      // this.sendQQ(this.inputContent)
      // this.sendGroup(this.inputContent)
      var data = {qq: "me"}
      data.content = this.inputContent
      if(this.qqs[this.currentIndex].type ===2){
        this.qqsMsgs[this.currentIndex].push(data)
        this.sendGroup(this.qqs[this.currentIndex].qq,this.inputContent)
      }else if(this.qqs[this.currentIndex].type ===1){
        this.qqsMsgs[this.currentIndex].push(data)
        this.sendQQ(this.qqs[this.currentIndex].qq,this.inputContent)
      }
      this.inputContent = ""
      this.chooseWhow()
    }
    ,clearMessage(){
      // this.initData() //初始化全部
      this.qqsMsgs[this.currentIndex] = [] // 初始化选择那块
      this.currentData = ""
    }
    ,sendData(type,group,qq,content){
      return{
        id: Math.floor(Math.random()*100000)+''
        ,method: "sendMessage"
        ,params: {
          type
          ,msgid: ''
          ,group
          ,qq
          ,content
        }
      }
    }
    ,showDesc(){
      alert(this.qqs[this.currentIndex].desc)
    }
  }
  ,mounted: function(){
    //alert("测试按钮")//require("@/assets/setting.json")

    // 如果是网页-- 不用网页了，如果是请求，需要放在根目录下，如请求位置
    // this.$axios.get("/setting.json").then(res=>{
    //       this.initData(res.data)
    //       this.init() // 初始化websockets
    // })
    // 如果不是网页
    var setting = require('@/assets/setting.json')
    // console.log(setting,typeof setting)
    this.initData(setting)
    this.init()
  }
  ,destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
  }
  ,components: {
    // QqMessage
  }
  ,watch:{
    currentData: function(/*val, val2*/){
      // console.log("了解data变化")
      this.$nextTick(()=>{
        //console.log("了解滚动变化")
        var container = this.$el.querySelector('.messages-group')
        container.scrollTop = container.scrollHeight
      })
    }
    ,currentIndex: function(/*val,val2*/){
      this.currentData = this.qqsMsgs[this.currentIndex]
      this.currentTitle = this.qqs[this.currentIndex].qqname
      // alert(this.currentTitle)
    }
  }
}
</script>

<style>
#qq-message {
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
