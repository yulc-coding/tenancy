// miniprogram/pages/room-info/room-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: null,
    owner: {
      name: '',
      phone: ''
    },
    scroll: {
      open: false,
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
  }


})