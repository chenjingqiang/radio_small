// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    kong_dian:true,
    wx_kong_dian: false,
    money_jian_tf:false,
    money:0,
    money_zhifu:0,
    money_jian: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    var openid = wx.getStorageSync('openid') || ''
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
    var that=this
    that.setData({
      pay_tf:true
    })
    wx.request({
      url: 'https://www.uear.net/ajax2/check_money.php',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: function (res) {
        var data = res.data.data
        //console.log(data)
        that.setData({
          money: data.money,
          money_zhifu: data.money,
          money_jian: data.wallet
        })
      }
    })
  },
  change:function(e){
    //console.log('订单金额：' + this.data.money)
    //console.log('钱包金额：' + this.data.money_jian)
    if (e.currentTarget.dataset.type=='zhanghu'){
      if (this.data.wx_kong_dian == false) {
        if (this.data.money_jian > this.data.money || this.data.money_jian == this.data.money) {
          //余额大于订单金额
          this.setData({
            wx_kong_dian: true,
            money_jian_tf: false,
          })
          if (this.data.kong_dian == true) {
            var money = 0
          }
        }else {
          //余额小于订单金额
          if (this.data.kong_dian == true) {
            var money = this.data.money - this.data.money_jian
          } else {
            var money = this.data.money
          }
          this.setData({
            money_jian_tf: !this.data.money_jian_tf,
          })
        }
        this.setData({
          kong_dian: !this.data.kong_dian,
          money_zhifu: money
        })
      }
    }else{
      if(this.data.kong_dian==false){
        if (this.data.money_jian > this.data.money) {
          //余额大于订单金额
          var money = this.data.money
          this.setData({
            kong_dian: true,
            money_zhifu: money
          })
          this.setData({
            wx_kong_dian: !this.data.wx_kong_dian
          })
        }
      }
    }
  },
  pay:function(){
    //console.log(this.data.money_zhifu)
    var that = this
      //混合支付
    if (that.data.wx_kong_dian == false && that.data.kong_dian == false) {
      //console.log('混合支付')
      wx.request({
        url: 'https://www.uear.net/ajax2/pay.php',
        data: {
          openid: that.data.openid,
          total_fee: that.data.money_zhifu
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data.data)
          var data = res.data.data
          wx.requestPayment({
            timeStamp: data.timeStamp + '',//时间戳
            nonceStr: data.nonceStr, //随机字符串长度
            package: data.package,  //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
            signType: 'MD5', //签名算法
            paySign: data.paySign,     //签名
            success(res) {
              wx.request({
                url: 'https://www.uear.net/ajax2/release_success.php',
                data: {
                  openid: that.data.openid,
                  mark:1
                },
                method: 'GET',
                success: function (res) {
                  if (res.data.code == 1) {
                    wx.setStorageSync('status', true)
                    wx.reLaunch({
                      url: '/pages/status/status',
                    })
                  }

                }
              })

            },
            fail(res) { }
          })

        }
      })
    }
    //微信支付
    if (that.data.wx_kong_dian == false && that.data.kong_dian == true){
      //console.log('微信支付')
      wx.request({
        url: 'https://www.uear.net/ajax2/pay.php',
        data: {
          openid: that.data.openid,
          total_fee: that.data.money_zhifu
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data.data)
          var data = res.data.data
          wx.requestPayment({
            timeStamp: data.timeStamp+'',//时间戳
            nonceStr: data.nonceStr, //随机字符串长度
            package: data.package,  //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
            signType: 'MD5', //签名算法
            paySign: data.paySign,     //签名
            success(res) {
              wx.request({
                url: 'https://www.uear.net/ajax2/release_success.php',
                data: {
                  openid: that.data.openid
                },
                method: 'GET',
                success: function (res) {
                  if(res.data.code==1){
                    wx.setStorageSync('status', true)
                    wx.reLaunch({
                      url: '/pages/status/status',
                    })
                  }
                
                }
              })

            },
            fail(res) { }
          })

        }
      })
    }
    //账户支付
    if (that.data.kong_dian == false && that.data.wx_kong_dian == true){
     //console.log('账户支付')
      wx.request({
        url: 'https://www.uear.net/ajax2/pay_wallet.php',
        data: {
          openid: that.data.openid
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code==1){
            wx.request({
              url: 'https://www.uear.net/ajax2/release_success.php',
              data: {
                openid: that.data.openid
              },
              method: 'GET',
              success: function (res) {
                if (res.data.code == 1) {
                  wx.setStorageSync('status', true)
                  wx.reLaunch({
                    url: '/pages/status/status',
                  })
                }
              }
            })
          }
        }
      })
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

  }
})