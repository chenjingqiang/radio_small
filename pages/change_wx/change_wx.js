// pages/change_wx/change_wx.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    wxid:'',
    sub_tf:true,
    place: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '修改联系方式'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid:openid
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {
    var that=this
    util.get_title(that)
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax4/get_wxid.php',
      data: {
        openid: this.data.openid,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data.wxid)
        that.setData({
          place: res.data.data.wxid,
          wxid:''
        })
      }
    })
  },
  inputs:function(e){
    this.setData({
      wxid: e.detail.value
    })
    if(this.data.wxid!=''){
      this.setData({
        sub_tf: false
      })
    }else{
      this.setData({
        sub_tf: true
      })
    }
  },
  sub: function () {
    var that=this
    if (!this.data.sub_tf == true) {
      wx.request({
        //判断
        url: 'https://www.uear.net/ajax4/change_wxid.php',
        data: {
          openid: this.data.openid,
          wxid: this.data.wxid
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code==1){
            wx.showToast({
              title: '修改成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            that.onShow()
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */

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