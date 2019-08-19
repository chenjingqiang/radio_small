// pages/detil/detil.js

const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    longitude:'',
    latitude:'',
    yinying: true,
    t_f: true,
    nan_nv:'',
    name: '',
    age: '',
    add1: '',
    add2: '',
    wxid: '',
    picker_value: '',
    biaoqian_select:[],
    yuyan_arr: [],
    beijing: '',
    jingli: '',
    nianxian: '',
    wx_img: '',
    browse: '',
    distance:'',
    flower:[],
    show_dong:true,
    miao:0,
    tempFilePath:'',
    tit:'',
    grade_num:'',
    grade_name:'',
    dj_top:'',
    photoUrl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    
    var openid = wx.getStorageSync('openid') || ''
    var detil_id = wx.getStorageSync('detil_id');
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    this.setData({
      openid: openid,
      longitude: longitude,
      latitude: latitude
    })
    var share_detil = wx.getStorageSync('share_detil') || ''
    if (share_detil){
      wx.getLocation({ // 请求位置信息
        type: 'gcj02',
        success(res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          wx.setStorageSync('latitude', res.latitude)
          wx.setStorageSync('longitude', res.longitude)
        }
      }) 
    }
    
    innerAudioContext.onEnded(() => {
      //console.log('自动停止')
      this.setData({
        show_dong: true
      })
    })
    //停止播放
    innerAudioContext.onStop(() => {
      //console.log('手动停止')
      this.setData({
        show_dong: true
      })
    })
    //分享标题
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/random_text.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          tit: res.data.data
        })
      }
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/browse_plus.php',
      data: {
        openid: detil_id
      },
      method: 'GET',
      success: function (res) {
      }
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/trandlator_details.php',
      data: {
        openid: detil_id,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      },
      method: 'GET',
      success: function (res) {
        var data = res.data.data
        console.log(data)
        var yuyan2_arr = data.major_certificate
        var yuyan2 = []
        for (var i = 0; i < yuyan2_arr.length; i++) {
          var aaa = yuyan2_arr[i]
          if (i < yuyan2_arr.length - 1) {
            aaa = yuyan2_arr[i] + '、'
          }
          yuyan2.push(aaa)
        }
        var percentage = data.percentage.split('%')[0]/100
        var dj_top = (160 * percentage)+'rpx'
        that.setData({
          nan_nv: data.wx_sex,
          name: data.wx_name,
          age: data.wx_age,
          add1: data.country,
          add2: data.city,
          wxid: data.wxid,
          picker_value: data.education,
          yuyan_arr: data.language,
          beijing: data.background,
          jingli: data.work_text,
          nianxian: data.work_years,
          wx_img: data.wx_img,
          browse: data.browse,
          yuyan2_arr: yuyan2,
          names2: data.major_scene,
          source: data.source,
          biaoqian_select: data.major_scene,
          distance: data.distance,
          flower: data.flower,
          miao: data.voice_second,
          tempFilePath: data.voice,
          grade_num: data.grade_num,
          grade_name: data.grade_name,
          dj_top: dj_top,
          photoUrl: data.photoUrl
        })
      },
      complete: function () {
        wx.hideLoading()
      }
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
    
  },
  ckwxid: function (e) {
    this.setData({
      yinying: false,
      t_f: false,
    })
  },
  change_wxid: function () {
    this.setData({
      yinying: true,
      t_f: true
    })
  },
  fuzhi: function () {
    var that = this
    wx.setClipboardData({
      data: this.data.wxid,
      success: function (res) {
      }
    })
  },
  //播放录音
  play: function () {
    if (this.data.show_dong) {
      innerAudioContext.src = this.data.tempFilePath,
      innerAudioContext.autoplay = true
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        //console.log('开始播放')
      })
      this.setData({
        show_dong: false
      })
    }else{
      innerAudioContext.stop()
      this.setData({
        show_dong: true
      })
    }
  },
  //查看大图
  previewImg: function(e){
    var wx_img =this.data.wx_img;
    var imgArr = []
    imgArr.push(wx_img)
    wx.previewImage({
      current: 1,     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //
  //查看大图
  previewImg2: function (e) {
    var index=e.currentTarget.dataset.imgindex
    var imgArr = this.data.photoUrl
    wx.previewImage({
      current: index,     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    var share_detil = wx.getStorageSync('share_detil')||''
    if (share_detil){
      wx.setStorageSync('share_detil', false)
      wx.reLaunch({
        url: '/pages/rob/rob',
      })

    }
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
    var detil_id = wx.getStorageSync('detil_id')||'';
    return {

      title: this.data.tit,

      desc: '分享页面的内容',

      path: '/pages/start/start?detil_id='+detil_id

    }
  }
})