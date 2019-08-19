// pages/become/become.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '', 
    userInfo: {},
    tit:'',
    code:0,
    nan_nv:'女',
    name:'',
    age:'',
    add1:'',
    add2:'',
    wxid:'',
    range: ["高中","大专","本科专修","硕士","博士"],
    picker_value:'点击选择学历',
    yuyan_arr:[],
    yuyan_arr_length:0,
    yuyan_value:'',
    yuyan2_arr: [],
    yuyan2_arr_length: 0,
    yuyan2_value: '',
    beijing:'',
    nianxian:'',
    jingli:'',
    biaoqian_select_length:0,
    biaoqian_select:[],
    names2:[],
    source:'',
    start_time: 0,
    textarea_tf:true,
    yin_box: false,
    luyin_wancheng: false,
    luyin_ing: false,
    luyin_complete: false,
    close_luyin_tf: true,
    miao: 1,
    miao2: 1,
    timer: '',
    tempFilePath: '',
    tempFilePath2: '',
    show_dong: true,
    image_arr: [],
    aub_images: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    util.get_title(that)
    var openid=wx.getStorageSync('openid')
    this.setData({
      openid:openid
    })
    if (app.globalData.userInfo.nickName) {
      //console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.userInfoReadyCallback = res => {
        //console.log('userInfoReadyCallback: ', res.userInfo);
        //console.log('获取用户信息成功');
        that.setData({
          userInfo: res.userInfo
        })
      }
    }
    //停止录音
    recorderManager.onStop((res) => {
      if (that.data.close_luyin_tf) {
        clearInterval(this.data.timer)
        this.data.tempFilePath = res.tempFilePath;
        //console.log('停止录音', res.tempFilePath)
      }
    })
    //停止播放
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_wxid.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        that.setData({
          wxid: res.data.data.wxid,
          biaoqian_select: res.data.data.scene
        })
      },
      complete: function () {
        //获取翻译官详情
        wx.request({
          url: 'https://www.uear.net/ajax4/trandlator_details.php',
          data: {
            openid: that.data.openid,
          },
          method: 'GET',
          success: function (res) {
            that.setData({
              code: res.data.code
            })
            if (res.data.code == 1) {
              var data = res.data.data
              var major_scene = res.data.data.major_scene
              var biaoqian_select = that.data.biaoqian_select
              for (var i = 0; i < biaoqian_select.length; i++) {
                for (var j = 0; j < major_scene.length; j++) {
                  if (biaoqian_select[i].name == major_scene[j]) {
                    biaoqian_select[i].mark = false
                  }
                }
              }
              //console.log(major_scene)
              //console.log(biaoqian_select)
              that.setData({
                nan_nv: data.wx_sex,
                name: data.wx_name,
                age: data.wx_age,
                add1: data.country,
                add2: data.city,
                wxid: data.wxid,
                picker_value: data.education,
                yuyan_arr: data.language,
                yuyan_arr_length: data.language.length,
                beijing: data.background,
                jingli: data.work_text,
                nianxian: data.work_years,
                yuyan2_arr: data.major_certificate,
                yuyan2_arr_length: data.major_certificate.length,
                names2: data.major_scene,
                biaoqian_select_length: data.major_scene.length,
                source: data.source,
                biaoqian_select: biaoqian_select,
                tempFilePath: data.voice,
                tempFilePath2: data.voice,
                miao: data.voice_second,
                miao2: data.voice_second,
                image_arr: data.photoUrl,
                aub_images: data.photoUrl
              })
              if (data.voice) {
                that.setData({
                  luyin_wancheng: true
                })
              } else {
                that.setData({
                  luyin_wancheng: false
                })
              }

            }
          },
          complete: function () {
            wx.hideLoading()
          }
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
    //获取微信id、标签
    
   
  },
  //开始录音 
  open_luyin_ing: function () {
    innerAudioContext.stop()
    const options = {
      //duration:5000,
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    wx.getSetting({
      success(res) {// 查看所有权限
        //console.log(res)
        let status = res.authSetting['scope.record']// 查看位置权限的状态，此处为初次请求，所以值为undefined
        if (status === false) {// 如果是首次授权(undefined)或者之前拒绝授权(false)
          wx.openSetting({
            success(data) {
              recorderManager.start((res) => {
              })
            }
          })
        }
      }
    })
    var that = this
    //开始录音
    recorderManager.start((res) => {
    })
    recorderManager.onStart((res) => {
      that.setData({
        miao: 1,
        textarea_tf: false
      })
      clearInterval(that.data.timer)
      var m = 1
      that.setData({
        luyin_ing: true,
        yin_box: true,
        luyin_wancheng: false,
        timer: setInterval(function () {
          m += 1
          that.setData({
            miao: m
          })
        }, 1000)
      })
    })
    //boolean scope.record
    //错误回调
    recorderManager.onError((res) => {
      //console.log(res);
    })
  },
  close_luyin_ing: function () {
    var that = this
    that.setData({
      luyin_ing: false,
      yin_box: false,
      miao: that.data.miao2,
      close_luyin_tf: false,
      tempFilePath: that.data.tempFilePath2,
      textarea_tf: true
    })
    clearInterval(that.data.timer)
    recorderManager.stop();
  },
  //停止录音
  stop_luyin: function () {
    var that = this
    that.setData({
      luyin_ing: false,
      luyin_complete: true,
      close_luyin_tf: true
    })
    clearInterval(that.data.timer)
    recorderManager.stop();

  },
  //播放录音
  play: function () {
    if (this.data.tempFilePath == '') {
      return
    }
    this.setData({
      show_dong: false
    })
    innerAudioContext.src = this.data.tempFilePath,
      innerAudioContext.autoplay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
  },
  wancheng: function () {
    innerAudioContext.stop()
    this.setData({
      luyin_complete: false,
      yin_box: false,
      luyin_wancheng: true,
      textarea_tf: true
    })
  },
  chonglu: function () {
    innerAudioContext.stop()
    var that = this
    this.setData({
      luyin_complete: false,
      luyin_ing: true,
      miao: 1,
      yin_box: true,
      textarea_tf: false
    })
    clearInterval(that.data.timer)
    var m = 1
    that.setData({
      luyin_ing: true,
      timer: setInterval(function () {
        m += 1
        that.setData({
          miao: m
        })
      }, 1000)
    })
    const options = {
      //duration:5000,
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    //错误回调
    recorderManager.onError((res) => {
      //console.log(res);
    })
  },

  //上传照片
  chooseImage(e) {
    var that = this
    wx.chooseImage({
      count: 8 - that.data.image_arr.length,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        var image_arr = this.data.image_arr.concat(res.tempFilePaths)
        // 限制最多只能留下8张照片
        image_arr = image_arr.length <= 8 ? image_arr : image_arr.slice(0, 8)
        that.setData({
          image_arr: image_arr
        })
        wx.showLoading({
          title: '等待',
        })
        for (var i = 0; i < image_arr.length; i++) {
          if (image_arr[i].indexOf('https:')==-1){

            wx.uploadFile({
              url: 'https://www.uear.net/ajax4/translator_upload_photo.php',
              filePath: image_arr[i],
              header: {
                'content-type': 'multipart/form-data'
              },
              name: 'file',
              success: function (res) {
                var data = JSON.parse(res.data)
                var aub_images = that.data.aub_images
                aub_images.push(data.data.photoUrl)
                var arr = aub_images
                var hash = [];
                for (var i = 0; i < arr.length; i++) {
                  if (hash.indexOf(arr[i]) == -1) {
                    hash.push(arr[i]);
                  }
                }
                that.setData({
                  aub_images: hash
                })
              },
              complete:function(){
                wx.hideLoading()
              }
            })
          }

        }


      }
    })
  },
  //删除
  removeImage(e) {
    const idx = e.target.dataset.idx
    var image_arr = this.data.image_arr
    var aub_images = this.data.aub_images
    image_arr.splice(idx, 1)
    aub_images.splice(idx, 1)
    this.setData({
      image_arr: image_arr,
      aub_images: aub_images
    })
  },
  //预览
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const image_arr = this.data.image_arr
    wx.previewImage({
      current: image_arr[idx],  //当前预览的图片
      urls: image_arr,  //所有要预览的图片
    })
  },
  
  
  
  
  
  
  
  
  
  
  
  nan:function(){
    this.setData({
      nan_nv:'男'
    })
  },
  nv: function () {
    this.setData({
      nan_nv: '女'
    })
  },
  name_value:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  age_value: function (e) {
    this.setData({
      age: e.detail.value
    })
  },
  add1_value: function (e) {
    this.setData({
      add1: e.detail.value
    })
  },
  add2_value: function (e) {
    this.setData({
      add2: e.detail.value
    })
  },
  phone_value: function (e) {
    this.setData({
      wxid: e.detail.value
    })
  },
  //选择学历
  bindPickerChange: function (e) {
    //console.log(e.detail)
    var index = e.detail.value
    this.setData({
      picker_value: this.data.range[index]
    })
  },
  //添加语言标签
  yuyan_value:function(e){
    //console.log(e.detail.value)
    var value = e.detail.value
    this.setData({
      yuyan_value: e.detail.value
    })
    
  },
  //添加语言标签
  add_yuyan:function(){
    if (this.data.yuyan_value == '') {
      wx.showToast({
        title: '语言标签不能为空',
        icon:'none'
      })
    }else{
      if (this.data.yuyan_arr.length < 8) {
        var arr = this.data.yuyan_arr
        arr.push(this.data.yuyan_value)
        this.setData({
          yuyan_arr: arr,
          yuyan_arr_length: arr.length
        })
      }
    }
  },
  //删除语言标签
  remove_yuyan:function(e){
    //console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var arr = this.data.yuyan_arr
    arr.splice(index, 1); 
    this.setData({
      yuyan_arr: arr,
      yuyan_arr_length: arr.length
    })
  },
  //添加语言能力等级
  yuyan2_value: function (e) {
    //console.log(e.detail.value)
    var value = e.detail.value
    this.setData({
      yuyan2_value: e.detail.value
    })

  },
  //添加语言能力等级
  add2_yuyan: function () {
    if (this.data.yuyan2_value == '') {
      wx.showToast({
        title: '语言标签不能为空',
        icon: 'none'
      })
    } else {
      if (this.data.yuyan2_arr.length < 8) {
        var arr = this.data.yuyan2_arr
        arr.push(this.data.yuyan2_value)
        this.setData({
          yuyan2_arr: arr,
          yuyan2_arr_length: arr.length
        })
      }
    }
  },
  //删除语言能力等级
  remove2_yuyan: function (e) {
    //console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var arr = this.data.yuyan2_arr
    arr.splice(index, 1);
    this.setData({
      yuyan2_arr: arr,
      yuyan2_arr_length: arr.length
    })
  },
  beijing_value: function (e) {
    this.setData({
      beijing: e.detail.value
    })
  },
  nianxian_value: function (e) {
    this.setData({
      nianxian: e.detail.value
    })
  },
  jingli_value: function (e) {
    this.setData({
      jingli: e.detail.value
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
      if (that.data.names2.length < 8) {
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
  source_value: function (e) {
    this.setData({
      source: e.detail.value
    })
  },
  sub:function(){
    var that=this
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      })
      return
    }
    if (this.data.age == '') {
      wx.showToast({
        title: '请填写年龄',
        icon: 'none'
      })
      return
    }
    if (this.data.add1 == '' || this.data.add2 == '') {
      wx.showToast({
        title: '请填写地区',
        icon: 'none'
      })
      return
    }
    if (this.data.wxid == '') {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none'
      })
      return
    }
    if (this.data.picker_value == '点击选择学历') {
      wx.showToast({
        title: '请选择最高学历',
        icon: 'none'
      })
      return
    }
    if (this.data.yuyan_arr==''){
      wx.showToast({
        title: '请填写语言标签',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    var language = this.data.yuyan_arr.join(',')
    var major_scene = this.data.names2.join(',')
    var major_certificate = this.data.yuyan2_arr.join(',')
    var aub_images = this.data.aub_images.join(',')
    var imageUrl = this.data.userInfo.avatarUrl.split('/');        //把头像的路径切成数组

    //把大小数值为 46 || 64 || 96 || 132 的转换为0
    if (imageUrl[imageUrl.length - 1] && (imageUrl[imageUrl.length - 1] == 46 || imageUrl[imageUrl.length - 1] == 64 || imageUrl  [imageUrl.length - 1] == 96 || imageUrl[imageUrl.length - 1] == 132)) {
      imageUrl[imageUrl.length - 1] = 0;
    }

    imageUrl = imageUrl.join('/');   //重新拼接为字符串
    var data = {
      openid: this.data.openid,
      wx_sex: this.data.nan_nv,
      wx_name: this.data.name,
      wx_img: imageUrl,
      wx_age: this.data.age,
      country: this.data.add1,
      city: this.data.add2,
      wxid: this.data.wxid,
      education: this.data.picker_value,
      language: language,
      background: this.data.beijing,
      work_text: this.data.jingli,
      work_years: this.data.nianxian,
      major_certificate: major_certificate,
      major_scene: major_scene,
      source: this.data.source,
      file:this.data.tempFilePath,
      second: this.data.miao,
      photoUrl:aub_images
    }
    if (this.data.code == 0) {
      if (that.data.tempFilePath===''){
        wx.request({
          url: 'https://www.uear.net/ajax4/translator.php',
          data: data,
          method: 'GET',
          success: function (res) {
            var data=res.data
            console.log(data)
            if (data.code == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                mark: true
              })
              wx.reLaunch({
                url: '/pages/wode/wode',
              })
            } else if (data.code == 0) {
              wx.showToast({
                title: '名字重复',
                icon: 'none',
                mark: true
              })
            } else if (data.code == 3) {
              wx.showToast({
                title: '名字超过字数',
                icon: 'none',
                mark: true
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                mark: true
              })
            }
          }
        })
      }else{
        wx.uploadFile({
          url: 'https://www.uear.net/ajax4/translator.php',
          filePath: that.data.tempFilePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: data,
          success: function (res) {
            var data = JSON.parse(res.data)
            console.log(data)
            if (data.code == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                mark: true
              })
              wx.reLaunch({
                url: '/pages/wode/wode',
              })
            } else if (data.code == 0) {
              wx.showToast({
                title: '名字重复',
                icon: 'none',
                mark: true
              })
            } else if (data.code == 3) {
              wx.showToast({
                title: '名字超过字数',
                icon: 'none',
                mark: true
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                mark: true
              })
            }
          }
        })
      }
    } else {
      if (that.data.tempFilePath === '') {
        wx.request({
          url: 'https://www.uear.net/ajax4/translator_update.php',
          data: data,
          method: 'GET',
          success: function (res) {
            var data = res.data
            if (data.code == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                mark: true
              })
              wx.reLaunch({
                url: '/pages/wode/wode',
              })
            } else if (data.code == 0) {
              wx.showToast({
                title: '名字重复',
                icon: 'none',
                mark: true
              })
            } else if (data.code == 3) {
              wx.showToast({
                title: '名字超过字数',
                icon: 'none',
                mark: true
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                mark: true
              })
            }
          }
        })
      }else{
        if (that.data.tempFilePath.indexOf('https') == -1) {
          var filePath = that.data.tempFilePath
        } else {
          var filePath = 'wxfile://' + that.data.tempFilePath.split('https://www.uear.net/mp3/')[1];
        }
        wx.uploadFile({
          url: 'https://www.uear.net/ajax4/translator_update.php',
          filePath: filePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: data,
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.code == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                mark: true
              })
              wx.reLaunch({
                url: '/pages/wode/wode',
              })
            } else if (data.code == 0) {
              wx.showToast({
                title: '名字重复',
                icon: 'none',
                mark: true
              })
            } else if (data.code == 3) {
              wx.showToast({
                title: '名字超过字数',
                icon: 'none',
                mark: true
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                mark: true
              })
            }
          }
        })
      }
    }
    
    
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