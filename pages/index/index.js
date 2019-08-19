//index.js
//获取应用实例


Page({
  data: {
    bar: [
      { 
        "index":0,
        "img": '../image/fabu.png',
        "img2": '../image/fabu2.png' ,
        "fn":'fabu'
      },
      {
        "index": 1,
        "img": '../image/dingdan.png',
        "img2": '../image/dingdan2.png',
        "fn": 'dingdan'
      },
      {
        "index": 1,
        "img": '../image/liulan.png',
        "img2": '../image/liulan2.png',
        "fn": 'liulan'
      },
      {
        "index": 1,
        "img": '../image/wode.png',
        "img2": '../image/wode2.png',
        "fn": 'wode'
      }
      
    ],
  },
  onLoad: function (options) {
   
  },
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
 
})
