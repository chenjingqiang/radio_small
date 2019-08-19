var app = getApp();
var util=require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    latitude: '',
    longitude: '',
    get_user: true,
    userInfo: {},
    ajaxurl: util.ajaxurl,
    wode_tf:false,
    textarea_tf:false,
    t_length:0,
    bar: ['../image/fabu.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan2.png', '../image/map2.png'],
    tit:'',
    dingdan_dian: false,
    yin_box:false,
    luyin_wancheng: false,
    luyin_ing:false,
    luyin_complete:false,
    close_luyin_tf:true,
    miao:1,
    timer:'',
    tempFilePath:'',
    show_dong:true,
    biaoqian_box:false,
    biaoqian_select:[],
    name:true,
    names2: [],
    array:[],
    arr_index:0,
    arr_value:'',
    array2: [],
    arr_index2: 0,
    arr_value2: '',
    money:0,
    zuidi_money:0,
    animation_sub:'',
    sub_box_text:'',
    text:'',
    left:'',
    value:'',
    value2:'请输入您的项目需求...',
    status_t_f:false,
    get_user:false,
    userInfo:'',
    time_value:'',
    didian_value: '',
    neirong_value: '',
    yaoqiu_value: '',
    day: 0, 
    plus_money:0,
    scroll:0,
    start_time:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var that = this
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
  onShow: function () {
    var that = this
    util.get_title(that)
    if (!that.data.userInfo) {
      that.setData({
        get_user: true
      })
    } else {
      that.setData({
        get_user: false
      })
      wx.request({
        url:  'https://www.uear.net/ajax2/wx_information.php',
        data: {
          openid: that.data.openid,
          nickName: that.data.userInfo.nickName,
          avatarUrl: that.data.userInfo.avatarUrl,
          city: that.data.userInfo.city,
          gender: that.data.userInfo.gender,

        },
        method: 'GET',
        success: function (res) {
          //console.log(res)
        }
      })
    }
    that.setData({
      arr_index: 0,
      arr_index2: 0
    })
    
    //获取标签
    wx.request({
      url: 'https://www.uear.net/ajax2/show_scene.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          biaoqian_select: res.data.data
        })
      }
    })
    //获取最低价格
    wx.request({
      url: 'https://www.uear.net/ajax2/check_order1.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        that.setData({
          zuidi_money:res.data.data
        })
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
        } else {
          that.setData({
            status_t_f: false,
          })
        }
      },
    })
    
  },
  //获取用户头像
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
  qiuyi: function () {
    wx.navigateTo({
      url: '/pages/status/status',
    })
  },
  release:function(){
    wx.redirectTo({
      url: '/pages/release/release',
    })
  },
  translate: function () {
    wx.redirectTo({
      url: '/pages/rob/rob',
    })
  },
 
  //
  get_time:function(e){
    var value = e.detail.value;
    this.setData({
      time_value: value
    })
  },
  get_didian: function (e) {
    var value = e.detail.value;
    this.setData({
      didian_value: value
    })
  },
  get_neirong: function (e) {
    var value = e.detail.value;
    this.setData({
      neirong_value: value
    })
  },
  get_yaoqiu: function (e) {
    var value = e.detail.value;
    this.setData({
      yaoqiu_value: value
    })
  },
  inputs:function(e){
    var value = e.detail.value;
    // 获取输入框内容的长度
    //var len = parseInt(value.length);
    this.setData({
      value:value,
      value2: value
    })
  },
  //打开标签
  open_biaoqian: function () {
    this.setData({
      yin_box:true,
      biaoqian_box:true,
      textarea_tf: false
    })
  },
  //关闭标签
  close_biaoqian:function(){
    //console.log(this.data.names2)
    var biaoqian_select = this.data.biaoqian_select
    for (var i = 0; i < biaoqian_select.length ; i++){
      biaoqian_select[i].mark=true
    }
    this.setData({
      name: true,
      yin_box: false,
      biaoqian_box: false,
      textarea_tf: true,
      names2:[],
      biaoqian_select: biaoqian_select
    })
  },
  //选择标签
  biaoqian_click:function(e){
    var that=this
    var name = e.currentTarget.dataset.name
    var mark = e.currentTarget.dataset.mark
    var index = e.currentTarget.dataset.index
    var names2 = that.data.names2
    if(mark){
      //console.log('未选中')
      if (that.data.names2.length < 2) {
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
      }
    }else{
      //console.log('选中')
      var biaoqian_select = that.data.biaoqian_select
      biaoqian_select[index].mark = !biaoqian_select[index].mark
      that.setData({
        biaoqian_select: biaoqian_select
      })
     var cha_index=names2.indexOf(name);
      names2.splice(cha_index,1)
    }
    that.setData({
      names2: names2
    })
    
  },
  //确认标签
  sub_biaoqian:function(){
    if (this.data.names2 != '') {
      this.setData({
        name:false,
        yin_box: false,
        biaoqian_box: false, 
        textarea_tf: true
      })
    }else{
      var biaoqian_select = this.data.biaoqian_select
      for (var i = 0; i < biaoqian_select.length; i++) {
        biaoqian_select[i].mark = true
      }
      this.setData({
        name: true,
        yin_box: false,
        biaoqian_box: false,
        textarea_tf: true,
        names2: [],
        biaoqian_select: biaoqian_select
      })
    }
  },
  get_money:function(e){
    //console.log(e.detail.value)
    var plus_money = Number(e.detail.value)
    var day=Number(this.data.day)
    this.setData({
      plus_money: plus_money,
      money: day + plus_money
    })
  },
  get_day: function (e) {
    //console.log(e.detail.value)
    var day = Number(e.detail.value)
    var plus_money = Number(this.data.plus_money)
    this.setData({
      day: day,
      money: day + plus_money
    })
  },
  lange1_value:function(e){
    //console.log(e.detail.value)
    this.setData({
      arr_value: e.detail.value
    })
  },
  lange2_value: function (e) {
    //console.log(e.detail.value)
    this.setData({
      arr_value2: e.detail.value
    })
  },
  //提交确认
  sub: function () {
    var that=this
    wx.setStorageSync('money', that.data.money)
    var query = wx.createSelectorQuery();
    if (this.data.arr_value == '') {
      this.setData({
        sub_box_text: '源语言不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.arr_value2 == '') {
      this.setData({
        sub_box_text: '目标语言不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.time_value == '') {
      this.setData({
        sub_box_text: '项目时间不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.didian_value == '') {
      this.setData({
        sub_box_text: '项目地点不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.neirong_value == '') {
      this.setData({
        sub_box_text: '工作内容不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.yaoqiu_value == '') {
      this.setData({
        sub_box_text: '专业要求不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    // if (this.data.day == 0) {
    //   this.setData({
    //     sub_box_text: '请填写天数'
    //   })
    //   query.select('.sub_box').boundingClientRect(function (rect) {
    //     var left = '-' + rect.width + 'rpx'
    //     that.setData({
    //       left: left
    //     })
    //     var animation = wx.createAnimation({
    //       duration: 1000,
    //     })
    //     animation.opacity(0.7).step();
    //     that.setData({
    //       animation_sub: animation.export()
    //     })
    //     clearTimeout(timer)
    //     var timer = setTimeout(function () {
    //       var animation = wx.createAnimation({
    //         duration: 1000,
    //       })
    //       animation.opacity(0).step();
    //       that.setData({
    //         animation_sub: animation.export()
    //       })
    //     }, 1000)
    //   }).exec();
    //   return;
    // }
    var data={
      openid: that.data.openid,
      language: that.data.arr_value,
      language2: that.data.arr_value2,
      project_time: that.data.time_value,
      project_address: that.data.didian_value,
      project_theme: that.data.neirong_value,
      project_skill: that.data.yaoqiu_value,
      money: 7,
      plus_money: that.data.plus_money,
      now_money: that.data.money,
      scene: that.data.names2,
      text: that.data.value
    }
    wx.showLoading({
      title: '下单中',
      mask: true
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/release2.php',
      data: data,
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          wx.showToast({
            title: '下单成功',
            icon: 'success',
            mark: true
          })
        }
      }
    })
    // wx.request({
    //   url: 'https://www.uear.net/ajax4/release1.php',
    //   data: data,
    //   method: 'GET',
    //   success: function (res) {
    //     var release_oid = res.data.data.oid
    //     wx.setStorageSync('release_oid', release_oid)
    //     if (res.data.code == 1) {
    //       wx.navigateTo({
    //         url: '/pages/pay/pay',
    //       })
    //     }
    //   },complete:function(){
    //     wx.hideLoading()
    //   }
    // })
  },
  onPageScroll: function (e) {
    if (e.scrollTop>50){
      this.setData({
        textarea_tf: true
      })
    }else{
      this.setData({
        textarea_tf: false
      })
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShareAppMessage: function (res) {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})