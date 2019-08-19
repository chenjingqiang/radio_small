// pages/map/map.js
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    latitude:0,
    longitude:0,
    markers:[],
    bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan2.png', '../image/map.png'],
    get_user: true,
    shezhi_tf:false,
    qp_tf:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    that.setData({
      openid: openid, 
      latitude: latitude,
      longitude: longitude
    })
    if (app.globalData.userInfo.nickName) {
      //console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        get_user: false
      })
    } else {
      app.userInfoReadyCallback = res => {
        //console.log('userInfoReadyCallback: ', res.userInfo);
        //console.log('获取用户信息成功');
        that.setData({
          userInfo: res.userInfo,
          get_user: false
        })
      }
    }
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
     //获取翻译官状态
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_status.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code==1){
          that.setData({
            shezhi_tf: true
          })
          var qp_tf = wx.getStorageSync('qp_tf') || 0
          //console.log(qp_tf)
          //0显示 1消失
          if (qp_tf == 0) {
            that.setData({
              qp_tf: 0,
            })
          } else {
            that.setData({
              qp_tf: 1,
            })
          }
        }else{
          that.setData({
            shezhi_tf: false,
            qp_tf: 1
          })
        }
      },
    })
    //获取翻译官
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_map.php',
      data: {
        openid: this.data.openid,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
      },
      method: 'GET',
      success: function (res) {
        var marker = res.data.data
        for(var i=0;i<marker.length;i++){
          marker[i].width = '80rpx'
          marker[i].height = '80rpx'
        }
        that.setData({
          markers:marker
        })
        wx.hideLoading()
      },
      complete:function(){
      }
    })
  },
  qp:function(){
    wx.setStorageSync('qp_tf', 1)
    this.setData({
      qp_tf: 1
    })
  },
  markersAction: function (e) {
    var markerId = e.markerId
    //console.log(markerId)
    wx.setStorageSync('detil_id', markerId)
    wx.navigateTo({
      url: '/pages/detil/detil',
    })
  },
  shezhi:function(){
    wx.navigateTo({
      url: '/pages/shezhi/shezhi',
    })
  },
  //底部导航
  fabu: function () {
    wx.redirectTo({
      url: '/pages/rob/rob',
    })
  },
  liulan: function () {
    wx.redirectTo({
      url: '/pages/liulan/liulan',
    })
  },
  map: function () {
   wx.redirectTo({
      url: '/pages/map/map',
    })
  },
  dingdan: function () {
   wx.redirectTo({
      url: '/pages/dingdan/dingdan',
    })
  },
  wode: function () {
   wx.redirectTo({
      url: '/pages/wode/wode',
    })
  },
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        //console.log(res.userInfo)
        getApp().globalData.userInfo = res.userInfo
        that.setData({
          get_user: false,
          userInfo: res.userInfo
        })
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