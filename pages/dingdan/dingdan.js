// pages/dingdan/dingdan.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    latitude:'',
    longitude:'',
    get_user: true,
    userInfo: {},
    kong:false,
    header: [{ cla: true, tet: '全部' }, { cla: false, tet: '我发布的' }, { cla: false, tet: '我抢到的' }],
    type:'all',
    select:[],
    tit_money:0,
    shouxufei:0,
    oid:'',
    identity:'',
    yinying_shanchu: false,
    yinying:false,
    yinying_tuidan:false,
    yinying_tuidan2:false,
    yinying_jieshoutuidan: false,
    bar: ['../image/fabu2.png', '../image/dingdan.png', '../image/wode2.png', '../image/liulan2.png', '../image/map2.png'],
    wode_tf: false,
    textarea_tf: true,
    tit:'',
    status_t_f:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.setNavigationBarTitle({
      title: '发单记录'
    })
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
        this.setData({
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
    that.setData({
      yinying: false,
      yinying_tuidan: false,
      yinying_shanchu: false,
      yinying_tuidan2: false,
      yinying_jieshoutuidan:false
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/list_myorder1.php',
      data: {
        openid: this.data.openid,
        type:this.data.type
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.data==''){
          that.setData({
            kong: true,
            select:[]
          })
        }else{
          that.setData({
            select: res.data.data,
            kong:false
          })
        }
      }
    })
    
    //获取求译状态
    wx.request({
      url: 'https://www.uear.net/ajax2/check_success.php',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (res.data.code == 1) {
          that.setData({
            status_t_f: true,
          })
        }else{
          that.setData({
            status_t_f: false,
          })
        }
      },
    })
   
  },

  qiuyi: function () {
    wx.navigateTo({
      url: '/pages/status/status',
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
  //删除订单
  dingdan_shanchu: function (e) {
    this.setData({
      oid: e.currentTarget.dataset.oid,
      yinying: true,
      yinying_shanchu: true
    })

  },
  shanchu: function () {
    var that = this
    var oid = that.data.oid
    wx.request({
      url: 'https://www.uear.net/ajax4/order_complete.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })
  },
  wancheng: function (e) {
    this.setData({
      oid: e.currentTarget.dataset.oid,
    })
    var that = this
    var oid = that.data.oid
    wx.request({
      url: 'https://www.uear.net/ajax4/order_complete.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '完成订单',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })
  },
  zaixiang:function(){
    this.setData({
      yinying: false,
      yinying_shanchu: false,
      yinying_tuidan: false,
      yinying_tuidan2: false,
      yinying_jieshoutuidan: false
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
    var that = this
    wx.getSetting({
      success(res) {// 查看所有权限
        //console.log(res)
        let status = res.authSetting['scope.userLocation']// 查看位置权限的状态，此处为初次请求，所以值为undefined
        if (!status || that.data.longitude == '') {// 如果是首次授权(undefined)或者之前拒绝授权(false)
          wx.openSetting({
            success(data) {
              if (data.authSetting["scope.userLocation"] == true) {
                wx.getLocation({ // 请求位置信息
                  type: 'gcj02',
                  success(res) {
                    //console.log(res);
                    that.setData({
                      latitude: res.latitude,
                      longitude: res.longitude
                    })
                    wx.setStorageSync('latitude', res.latitude)
                    wx.setStorageSync('longitude', res.longitude)
                  }
                })
              }
            }
          })
        } else {
          wx.request({
            url: 'https://www.uear.net/ajax4/translator_status1.php',
            data: {
              openid: that.data.openid
            },
            method: 'GET',
            success: function (res) {
              if (res.data.code == 0) {
                if (that.data.longitude == '' || that.data.latitude == '') {
                  wx.showToast({
                    title: '请开启手机定位',
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  var data = {
                    openid: that.data.openid,
                    flower_imgs: 0,
                    longitude: that.data.longitude,
                    latitude: that.data.latitude,
                    mark: 1
                  }
                  wx.request({
                    url: 'https://www.uear.net/ajax4/translator_flower_submit.php',
                    data: data,
                    method: 'GET',
                    success: function (res) {
                    },
                  })
                }
              }
            },
            complete: function () {
              wx.redirectTo({
                url: '/pages/map/map',
              })
            }
          })
        }
      }
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})