// pages/start/start.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid') || ''
    if (openid==''){
      app.getToken().then((resArg) => {
        if (options.detil_id){
          wx.setStorageSync('detil_id', options.detil_id)
          wx.setStorageSync('share_detil', true)
          wx.navigateTo({
            url: '/pages/detil/detil',
          })
        }else{
          wx.redirectTo({
            url: '/pages/rob/rob',
          })
        }
        
      })
    }else{
      if (options.detil_id) {
        wx.setStorageSync('detil_id', options.detil_id)
        wx.setStorageSync('share_detil', true)
        wx.navigateTo({
          url: '/pages/detil/detil',
        })
      } else {
        wx.redirectTo({
          url: '/pages/rob/rob',
        })
      }
    }
    
  },
  onShow: function () {
    // var openid = wx.getStorageSync('openid') || ''
    // // console.log(2)
    // // console.log(openid)
    // if (openid == '') {
    //   app.getToken().then((resArg) => {
    //     // console.log(resArg)
    //     // console.log(1)
    //     wx.redirectTo({
    //       url: '/pages/rob/rob',
    //     })
    //   })
    // } else {
    //   //console.log(2)
    //   wx.redirectTo({
    //     url: '/pages/rob/rob',
    //   })
    // }
    
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

  }
})