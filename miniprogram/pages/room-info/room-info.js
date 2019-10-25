// miniprogram/pages/room-info/room-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: null,
    owner: null,
    swiper: {
      circular: true, //是否采用衔接滑动
      indicatorDots: true, //是否显示面板指示点
      autoplay: false, //是否开启自动切换
      interval: 3000, //自动切换时间间隔
      duration: 500 //滑动动画时长
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var roomId = options.roomId;

    const db = wx.cloud.database()
    db.collection('room').doc(roomId).get()
      .then(res => {
        this.setData({
          room: res.data
        })
      })
      .catch(err => console.error(err))
  },

  /**
   * 获取户主的称呼和联系电话
   */
  getOwner() {
    var ownerid = this.data.room._openid
    const db = wx.cloud.database()
    db.collection('user')
      .where({
        _openid: ownerid
      })
      .get()
      .then(res => {
        this.setData({
          owner: res.data[0]
        })
      })
      .catch(err => console.error(err))

  }

})