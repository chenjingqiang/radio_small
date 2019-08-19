// pages/biaoqian/biaoqian.js
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '', 
    biaoqian_select:[],
    names2:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid')
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.get_title(that)
    if (app.globalData.names2) {
      var names2 = app.globalData.names2
    } else {
      names2 = []
    }
    this.setData({
      names2: names2
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_wxid.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        var biaoqian_select = res.data.data.scene
        var names2=that.data.names2
        for (var i = 0; i < biaoqian_select.length;i++){
          for (var j = 0; j < names2.length; j++){
            if (biaoqian_select[i].name == names2[j]){
              biaoqian_select[i].mark=false
            }
          }
        }
        that.setData({
          biaoqian_select: biaoqian_select
        })
        wx.hideLoading()
      }
    })
  },
  //标签
  biaoqian_click: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var mark = e.currentTarget.dataset.mark
    var index = e.currentTarget.dataset.index
    var names2 = that.data.names2

    if (mark) {
      //console.log('未选中')
      if (names2.indexOf(name) == -1) {
        //console.log('没有')
        names2.push(name)
      } else {
        //console.log('有')
      }
      var biaoqian_select = that.data.biaoqian_select
      biaoqian_select[index].mark = !biaoqian_select[index].mark
      that.setData({
        biaoqian_select: biaoqian_select,
      })
      
    } else {
      //console.log('选中')
      var biaoqian_select = that.data.biaoqian_select
      biaoqian_select[index].mark = !biaoqian_select[index].mark
      that.setData({
        biaoqian_select: biaoqian_select
      })
      var cha_index = names2.indexOf(name);
      names2.splice(cha_index, 1)
    }
    that.setData({
      names2: names2,
      biaoqian_select_length: names2.length
    })
    //console.log(names2)
  },
  chongzhi:function () {
    var that=this
    //console.log(names2)
    var biaoqian_select = that.data.biaoqian_select
    for (var i = 0; i < biaoqian_select.length;i++){
      biaoqian_select[i].mark=true 
    }
    this.setData({
      biaoqian_select: biaoqian_select,
      names2:[]
    })
  },
  sub: function () { 
    var that=this
    var names2 = that.data.names2
    //console.log(names2)
    app.globalData.names2 = names2
    app.globalData.search = true
    wx.navigateBack({
      delta: 1
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