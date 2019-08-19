// pages/qianbao/qianbao.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxid:'',
    money:'',
    service_charge:'',
    tixian:'',
    tishi: '',
    input_money:0,
    zuidi:0,
    input_value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '钱包'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
  },
  change_wx:function(){
    wx.navigateTo({
      url: '/pages/change_wx/change_wx',
    })
  },
  mingxi: function () {
    wx.navigateTo({
      url: '/pages/mingxi/mingxi',
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
    that.setData({
      tixian:''
    })
    util.get_title(that)
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/show_money.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          wxid: res.data.data.wxid,
          money: res.data.data.money,
          service_charge: res.data.data.service_charge,
          zuidi: res.data.data.zuidi
        })
      }
    })
  },
  input_value:function(e){
    //console.log(e.detail.value)
    this.setData({
      input_value: e.detail.value
    })
  },
  sub:function(){
    var that=this
    if (this.data.input_value==''){
      wx.showToast({
        title: '兑换码不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    wx.request({
      url: 'https://www.uear.net/ajax4/coupon_money.php',
      data: {
        openid: this.data.openid,
        coupon_number: this.data.input_value
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '' + res.data.message+'',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }else{
          wx.showToast({
            title: '优惠券错误或已使用',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
     
    
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