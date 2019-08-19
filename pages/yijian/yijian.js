// pages/yijian/yijian.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    te_value:'',
    input_value:'',
    sub_tf:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意见反馈'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    util.get_title(that)
  },
  bind_te:function(e){
    this.setData({
      te_value: e.detail.value
    })
    if (this.data.te_value != '' && this.data.input_value != ''){
      this.setData({
        sub_tf: false
      })
    }else {
      this.setData({
        sub_tf: true
      })
    }
  },
  bind_input: function (e) {
    this.setData({
      input_value: e.detail.value
    })
    if (this.data.te_value != '' && this.data.input_value != '') {
      this.setData({
        sub_tf: false
      })
    }else{
      this.setData({
        sub_tf: true
      })
    }
    
  },
  sub:function(){
    if(!this.data.sub_tf==true){
      wx.request({
        //判断
        url: 'https://www.uear.net/ajax2/opinion.php',
        data: {
          openid: this.data.openid,
          content:this.data.te_value,
          contact: this.data.input_value,
        },
        method: 'GET',
        success: function (res) {
          if(res.data.code==1){
            wx.showToast({
              title: '提交成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          }
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  }
})