const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var ajaxurl ='https://www.uear.net/ajax2/'

//获取分享标题
const get_title=function(that){
  wx.request({
    url: 'https://www.uear.net/ajax2/random_text.php',
    data: {
    },
    method: 'GET',
    success: function (res) {
      that.setData({
        tit: res.data.data
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  ajaxurl: ajaxurl,
  get_title: get_title
}
