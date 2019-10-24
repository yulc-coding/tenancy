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