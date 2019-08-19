// pages/shezhi/shezhi.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    latitude:'',
    longitude:'',
    mark:0,
    shezhi_tf: false,
    img:'',
    sub_tf: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    this.setData({
      openid: openid,
      latitude: latitude,
      longitude: longitude
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_flower.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        var data = res.data.data
        if (data.mark==0){
          that.setData({
            shezhi_tf:false,
            imgs: data.imgs,
            img: ''
          })
        }else{
          that.setData({
            shezhi_tf: true,
            imgs: data.imgs,
            img: data.num
          })
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  change_shezhi:function(){
    var that=this
    var shezhi_tf = that.data.shezhi_tf
    if (shezhi_tf){
      wx.showModal({
        title: '提示',
        cancelText: '确定',
        cancelColor: '#576B95',
        confirmText: '取消',
        confirmColor: '#000000',
        content: '确定要关闭定位吗？您的位置信息将不再显示在地图中，成单几率将会变低。',
        success(res) {
          if (res.confirm) {
          } else if (res.cancel) {
            that.setData({
              shezhi_tf: false,
            })
          }
        }
      })
    }else{
      that.setData({
        shezhi_tf: true,
      })
    }
  },
  click_img:function(e){
    var index = e.currentTarget.dataset.id-1
    var imgs = this.data.imgs
    var img=this.data.img
    if (imgs[index].status == false){
      imgs[index].status = true
      img=''
    }else{
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].status =true
      }
      imgs[index].status = false
      img=index
    }
    this.setData({
      imgs:imgs,
      img: img
    })
  },
  sub:function(){
    var that=this
    if (that.data.longitude == '' || that.data.latitude == ''){
      wx.showToast({
        title: '请开启手机定位',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.shezhi_tf){
      that.setData({
        mark:1
      })
    }else{
      that.setData({
        mark: 0
      })
    }
    if (that.data.shezhi_tf){
      if (that.data.img === ''){
        wx.showToast({
          title: '请选择您最擅长的语言',
          icon: 'none',
          duration: 2000
        })
        return
      }
   }
    if (!that.data.shezhi_tf) {
      if (that.data.img != '') {
        wx.showToast({
          title: '请开启按图索译',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    var data = {
      openid: this.data.openid,
      flower_imgs: this.data.img,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      mark: this.data.mark
    }
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_flower_submit.php',
      data: data,
      method: 'GET',
      success: function (res) {
        var data = res.data
        if(data.code==1){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '/pages/map/map',
          })
        }
      },
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