var app = getApp();
var util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    latitude: '',
    longitude: '',
    get_user:true,
    userInfo:{},
    wode_tf:false,
    textarea_tf:true,
    t_length:0,
    bar: ['../image/fabu.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan2.png', '../image/map2.png'],
    tit:'',
    dingdan_dian: false,
    height:'',
    animationData: "",
    paixu:'desc',
    order_status: 0,
    select:[],
    fu_id:'',
    kong: false,
    index:0,
    status_t_f:false,
    yinying:true,
    t_f:true,
    t_f2:true,
    t_f3: true,
    page:1,
    zaixian:0,
    wxid_true:false,
    wxid_value:'',
    type:false,
    rob_qp_tf:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
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
    that.setData({
      openid: openid,
    })
    // console.log(openid)
    if (app.globalData.userInfo.nickName) {
      //console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        get_user:false
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
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              updateManager.applyUpdate()
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
          })
        })
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    util.get_title(that)
    var rob_qp_tf = wx.getStorageSync('rob_qp_tf') || 0
    //0显示 1消失
    if (rob_qp_tf==0 ) {
      that.setData({
        rob_qp_tf: 0,
      })
    } else {
      that.setData({
        rob_qp_tf: 1,
      })
    }
    //初始动画
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0,
    })
    animation.height(0).step()
    that.setData({
      animationData: animation.export(),
    })
    that.setData({
      page:1,
      select:[],
      kong:false,
      yinying: true,
      t_f2: true,
      t_f3: true,
      wxid_true:false
    })
    //获取翻译官状态
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_status.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        
        if (res.data.code == 0) {
          that.setData({
            type: false,
          })
        } else {
          that.setData({
            type: true
          })
        }
      },
    })
    //获取用户是否填写微信号
    wx.request({
      url: 'https://www.uear.net/ajax4/get_mywxid.php',
      data: {
        openid: this.data.openid,
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          wxid_true: res.data.data
        })
      }
      //请求完成后执行的函数
    })
    //在线人数
    wx.request({
      url: 'https://www.uear.net/ajax4/peo_num.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          zaixian: res.data.data
        })
      }
    })
    //求译列表
    wx.request({
      url: 'https://www.uear.net/ajax4/show_order1.php',
      data: {
        openid:this.data.openid,
        orderby:this.data.paixu,
        order_status: this.data.order_status,
        page:1
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.data==''){
          that.setData({
            kong:true
          })
        }else{
          that.setData({
            select: res.data.data
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //下拉动画
  gettextHeight: function (e) {
    if (this.data.type) {
      if (e.currentTarget.dataset.text_mark) {
        var that = this
        var fu_id = e.currentTarget.dataset.oid
        var index = e.currentTarget.dataset.index
        var change_select = that.data.select
        change_select[index].text_mark = false
        change_select[index].text_short = ' '
        that.setData({
          fu_id: fu_id,
          select: change_select
        })
        var zi_id = e.currentTarget.dataset.oid2
        const query = wx.createSelectorQuery()
        var iii = '#' + zi_id
        query.select(iii).boundingClientRect()
        query.exec(function (res) {
          var animation = wx.createAnimation({
            duration: 400,
            timingFunction: "linear",
            delay: 0,
          })
          animation.height(res[0].height).step()
          that.setData({
            animationData: animation.export(),
          })
        })

      }
    } else {
      this.setData({
        yinying: false,
        t_f3:false
      })
    }
    
    
  },
  //去认证
  go_renzheng:function(){
    wx.navigateTo({
      url: '/pages/become/become',
    })
  },
  //更改抢单气泡
  change_rob_qp:function(){
    wx.setStorageSync('rob_qp_tf', 1)
    this.setData({
      rob_qp_tf:1
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
  //获取用户微信id
  get_wxid:function(e){
    var wxid_value = e.detail.value
    this.setData({
      wxid_value: wxid_value
    })
  },
  //关闭微信号弹窗
  tanchuang_weixin_close: function () {
    this.setData({
      yinying: true,
      t_f2: true
    })
  },
  //wxid提交
  wxid_sub:function(){
    var that=this
    if (that.data.wxid_value==''){
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    wx.request({
      url: 'https://www.uear.net/ajax4/change_wxid.php',
      data: {
        openid: this.data.openid,
        wxid: this.data.wxid_value
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }else{
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  //刷新
  shuaxin:function(){
    this.onShow()
  },
  ckwxid:function(e){
    var wx_id = e.currentTarget.dataset.wx_id
    if(this.data.type){
      this.setData({
        yinying: false,
        t_f: false,
        weixin: wx_id
      })
    }else{
      this.setData({
        yinying: false,
        t_f3: false
      })
    }
    
  },
  change_wxid:function(){
    this.setData({
      yinying: true,
      t_f: true
    })
  },
  change_tanchuang3: function () {
    this.setData({
      yinying: true,
      t_f3: true
    })
  },
  fuzhi: function () {
    var that = this
    wx.setClipboardData({
      data: this.data.weixin,
      success: function (res) {
      }
    })
  },
  //跳转发布
  release: function () {
    if (this.data.wxid_true) {
      wx.redirectTo({
        url: '/pages/release/release',
      })
    } else {
      this.setData({
        yinying: false,
        t_f2: false
      })
    }
  },
  //跳转列表
  translate: function () {
   wx.redirectTo({
      url: '/pages/rob/rob',
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
    if (this.data.wxid_true) {
      wx.getSetting({
        success(res) {// 查看所有权限
          //console.log(res)
          let status = res.authSetting['scope.userLocation']// 查看位置权限的状态，此处为初次请求，所以值为undefined
          if (!status||that.data.longitude=='') {// 如果是首次授权(undefined)或者之前拒绝授权(false)
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
              complete:function(){
                wx.redirectTo({
                  url: '/pages/map/map',
                })
              }
            })
          }
        }
      })
    } else {
      this.setData({
        yinying: false,
        t_f2: false
      })
    }
  },
  dingdan: function () {
    if(this.data.wxid_true){
      wx.redirectTo({
        url: '/pages/dingdan/dingdan',
      })
    }else{
      this.setData({
        yinying: false,
        t_f2: false
      })
    }
    
  },
  wode: function () {
    if (this.data.wxid_true) {
      wx.redirectTo({
        url: '/pages/wode/wode',
      })
    } else {
      this.setData({
        yinying: false,
        t_f2: false
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      page: 1,
      select: [],
      kong: false,
      yinying: true,
      t_f2: true,
      t_f3: true,
      wxid_true: false
    })
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
    //console.log('触发')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that=this
    var page = that.data.page+1
    that.setData({
      page:page
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/show_order1.php',
      data: {
        openid: this.data.openid,
        orderby: this.data.paixu,
        order_status: this.data.order_status,
        page: that.data.page
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          select: that.data.select.concat(res.data.data)
        })
        //console.log('成功')
      },
      complete: function () {
        wx.hideLoading()
      }
    })



  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})