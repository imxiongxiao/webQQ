<template>
  <div id="web-socket">
      <b-card class="test-method" header="接口测试">
        <b-card-group columns>
          <div v-for="(items, index) in testMethods" :key ="index">
              <b-card class="desc" :header="items.name">
                <b-card-body>{{items.desc}}</b-card-body>
                <b-textarea class="input-content" @keyup.ctrl.enter="sendMessage(index)" :value="JSON.stringify(items.sendContent)" ref="sendContent" rows="3" max-rows="6"/>
                <b-button variant="success" @click="sendMessage(index)">发送</b-button>
                <b-card-text>{{items.result}}</b-card-text>
              </b-card>
          </div>
        </b-card-group>
      </b-card>
      <!-- <b-img src="/favicon.ico" id="favicon"></b-img> -->
      <input type="file" name="files" id="files" />
      <b-button variant="info" @click="getPic" title="先绑定在点击上传文件">图片绑定</b-button>
      <b-card class="test-event" header="事件获取">
        <b-card-group columns>
          <div v-for="(items, index) in testEvents" :key ="index">
              <b-card class="desc" :header="items.name">
                <b-card-body>{{items.desc}}</b-card-body>
                <b-textarea class="input-content"  :value="JSON.stringify(items.getCOntent)" rows="3" max-rows="6"/>
                <b-card-text>{{items.result}}</b-card-text>
              </b-card>
          </div>
        </b-card-group>
      </b-card>
  </div>
</template>

<script>
// import QqMessage from '@/components/QqMessage.vue'
/** 接口问题记录： 
 *  1. id必须为字符串，type不能为字符串 ； 参数对应可以省略 type:2 可以省略 qq:"",msgid:"" 
 *  2. 发送群消息，不会返回msgid, 不会获得返回的id信息， 就不能撤回内容了！ 另一种意思，自己发送的消息，不会返回给自己，不能撤回自己发送的消息
 *  3. 获取群名片 没有结果
 *  4. 发送图片之后的结果 没有示例， 不能找到正确的
 */ 
export default {
  name: 'web-socket'
  ,data: function(){
    this.qq = "1019443290",this.addqq = "2838419654",this.deleteqq = "2838419654"
    this.group = "221941055"
    this.pic = ""
    this.sendPic = "[QQ:pic=6c866ab2-8e66-b834-1f8f-485cb22cfeaf.jpg]"
    return{
       path: ""
       ,id: ""
       ,testMethods : [
         {  name: "1. 发送内容给群",result:"", desc:"[QQ:pic=xxx]代表一张图片，[QQ:flash,pic=xxx]代表一张闪照", sendContent: { method: "sendMessage", id: '1', params: {type: 2, group: this.group, content: "测试发送给群："+this.group}} }
        ,{  name: "2. 发送内容给QQ",result:"", desc: "艾特QQ,[QQ:at=xxx]艾特全体[QQ:at=all] QQ表情[QQ:face=212] QQ[QQ:emoji=39091]", sendContent: { method: "sendMessage", id: '2', params: {type: 1, group: "", qq: this.qq, content:"测试[QQ:emoji=39091]发送给QQ: "+this.qq}} }
        ,{  name: "3. 撤回QQ消息--Air不支持撤回",result:"",desc:"需要提前知道msgid", sendContent: { method: "withdrawMessage", id: '3', params: {group: this.group, msgid:"请求返回，自写"}} }
        ,{  name: "4. 获取好友列表",result:"", sendContent: { method: "getFriendList", id: '4' } }
        ,{  name: "5. 添加好友信息--Air不支持加好友",result:"", sendContent: { method: "addFriend", id:'5', params: { qq:this.addqq,message:"验证信息可以选QQ："+this.addqq}} } 
        ,{  name: "6. 删除好友--Air不支持删除好友",result:"", sendContent: { method: "deleteFriend", id:'6', params: { qq:this.deleteqq }} } 
        ,{  name: "7. 获取群列表",result:"", sendContent: { method: "getGroupList", id:'7'} } 
        ,{  name: "8. 获取群成员列表",result:"", sendContent: { method: "getGroupMemberList", id:'8', params: { group: this.group }} } 
        ,{  name: "9. 添加群--Air不支持添加群",result:"", sendContent: { method: "addGroup", id:'9', params: { group: this.group,message: "验证消息，可选" }} } 
        ,{  name: "10. 退出群--Air支持退出群",result:"", sendContent: { method: "quitGroup", id:'10', params: { group: this.group,message: "验证消息，可选" }} } 
        ,{  name: "11. 获取群名片",result:"", sendContent: { method: "getGroupCard", id:'11', params: { group: this.group, qq: this.qq }} } 
        ,{  name: "12. 上传图片",result:"", desc: "群组类型为2-私聊为1,object为预发群号或者QQ号,data:图片转为16进制字符\n", sendContent: { method: "uploadImage", id:'12', params: { type: 2, object: this.group, data:this.pic }} } 
        ,{  name: "13. 发送图片",result:"", sendContent: { method: "sendMessage", id:'13', params: { type: 2, group: this.group, content: "测试发送给群："+this.group+"图片:"+ this.sendPic }} } 
        ,{  name: "14. 获取QQ资料",result:"", sendContent: { method: "getQQInfo", id:'14', params: {  qq: this.qq }} } 
        ,{  name: "15. 获取群资料",result:"", sendContent: { method: "getGroupInfo", id:'15', params: {  group: this.group }} } 
        ,{  name: "16. 邀请好友入群--Air不支持邀请好友入群",result:"", sendContent: { method: "inviteIntoGroup", id:'16', params: {  group: this.group,qq: this.qq }} } 
        ,{  name: "17. 设置群名片",result:"",desc: "会乱码", sendContent: { method: "setGroupCard", id:'17', params: {  group: this.group,qq: this.qq, name: "喝" }} } 
        ,{  name: "18. 获取当前登录账号",result:"",desc: "", sendContent: { method: "getLoginAccount", id:'18'} } 
        ,{  name: "19. 设置个性签名",result:"",desc: "会乱码", sendContent: { method: "setSignature", id:'19', params: { "content": "真有趣呀！" }} } 
        ,{  name: "20. 获取QQ昵称",result:"", sendContent: { method: "getNickname", id:'20', params: { qq: this.qq }} } 
        ,{  name: "21. 点赞名片",result:"", sendContent: { method: "givePraise", id:'21', params: { qq: this.qq }} } 
        ,{  name: "22. 处理好友请求",result:"", desc: "type 1=同意、2=拒绝、3=忽略 message仅在拒绝请求时有效", sendContent: { method: "handleFriendRequest", id:'22', params: { qq: this.qq, type: 2, message: "" }} } 
        ,{  name: "23. 设置在线状态",result:"", desc: "type 1=我在线上、2=Q我吧、3=离开、4=忙碌、5=请勿打扰、6=隐身", sendContent: { method: "setState", id:'23', params: { type: 1}} } 
        ,{  name: "24. 处理加群请求",result:"", desc: "seq 加群请求事件提供的序列号 type  1=同意、2=拒绝、3=忽略 message 拒绝时的拒绝理由，其它情况忽略", sendContent: { method: "setState", id:'24', params: { type: 1, group: this.group, qq: this.qq, seq: "",message: ""}} } 
        ,{  name: "25. 移除群成员",result:"", desc: "", sendContent: { method: "setState", id:'25', params: { group: this.group, qq: this.qq }} } 
        ,{  name: "26. 禁言",result:"", desc: "duration // 禁言时间，单位为秒，为0时解除禁言", sendContent: { method: "silence", id:'26', params: { group: this.group, qq: this.qq,duration: 0 }} } 
        ,{  name: "27. 全体禁言",result:"", desc: "enable// true为全体禁言,false为取消全体禁言", sendContent: { method: "globalSilence", id:'27', params: { group: this.group, enable: true}} } 
        ,{  name: "28. 获取Cookies",result:"", sendContent: { method: "getCookies", id:'28' } } 
        ,{  name: "29. 获取Bkn",result:"", sendContent: { method: "getBkn", id:'29' } } 
        ,{  name: "30. 获取ClientKey",result:"", sendContent: { method: "getClientKey", id:'30' } } 
        
       ]
       ,testEvents: [
          { name: "1. 收到消息", getCOntent :{ event: "message", params: { type: 2, group: "", qq: "", content: "", msgid: ""}}}
         ,{ name: "2. 收到好友请求", getCOntent :{ event: "friendRequest", params: { qq: "", message: "验证消息"}}}
         ,{ name: "3. 成为好友", getCOntent :{ event: "becomeFriends", params: { qq: ""}}}
         ,{ name: "4. 群成员增加",desc:"type 1=主动加群、2=被管理员邀请 operator 操作者QQ", getCOntent :{ event: "groupMemberIncrease", params: {type: 1, group: "", qq: "", operator: ""}}}
         ,{ name: "5. 群成员减少",desc:"type 1=主动退群、2=被管理员踢出 operator 操作者QQ，仅在被管理员踢出时存在", getCOntent :{ event: "groupMemberIncrease", params: {type: 1, group: "", qq: "", operator: ""}}}
         ,{ name: "6. 群管理员变动",desc:"type 1=成为管理 2=被解除管理 ", getCOntent :{ event: "adminChange", params: {type: 1, group: "", qq: ""}}}
         ,{ name: "7. 加群请求",desc:"type 1=主动加群、2=被邀请进群、3=机器人被邀请进群  operator 邀请者QQ，主动加群时不存在 seq 序列号，处理加群请求时需要用到", getCOntent :{ event: "groupRequest", params: {type: 1, group: "", qq: "",operator: "",message: "", seq: ""}}}
       ]
    }
  }
  ,methods: {
    initData(data){
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
        console.log("连接错误")
    }
    ,onMessage: function (msg) {
        console.log(msg.data)
        var data =JSON.parse(msg.data)
        // console.log(data.id)
        if(data.id){
          this.testMethods[data.id-1].result = msg.data
        }
    }
    ,close: function () {
        console.log("socket已经关闭")
    }
    ,sendMessage(index){
      // console.log( this.$refs.sendContent[index])
      var sendString = this.$refs.sendContent[index].localValue // value是传递进去的值
      console.log("发送内容",sendString)
      this.socket.send(sendString)
    }
    ,getPic(){
      // console.log("e",e)
      var that = this
      var input = document.getElementById("files")
      if(typeof FileReader==='undefined'){
          result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
          input.setAttribute('disabled','disabled')
      }else{
          input.addEventListener('change',function(){
              var file = this.files[0]
              if(!/image\/\w+/.test(file.type)){
                  alert("文件必须为图片！")
                  return false
              }
              var reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = function(e){
                  // console.log(this.result) //图片数据
                  var picture = this.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
                  console.log("图片：",this.result)
                  that.pic = this.result

                  var canvas = document.createElement("canvas");
                  canvas.width = img.width;
                  canvas.height = img.height;
                  // Copy the image contents to the canvas
                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0);
                  // Get the data-URL formatted image
                  // Firefox supports PNG and JPEG. You could check img.src to
                  // guess the original format, but be aware the using "image/jpg"
                  // will re-encode the image.
                  var dataURL = canvas.toDataURL("image/png");
                  cosnole.log("data:",dataURL.replace(/^data:image\/(png|jpg);base64,/, ""))
                  // result.innerHTML = '<img src="'+this.result+'" alt=""/>' //把数据显示到图片上，预览的效果
              }            
          },false)
      }
    }
  }
  ,mounted: function(){
    var setting = require('@/assets/setting.json')
    this.initData(setting)
    this.init()
  }
  ,destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
  }

  ,watch:{

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

</style>
