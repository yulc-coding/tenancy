// miniprogram/pages/db/db.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  onDbTest: function() {
    // const db = wx.cloud.database()
    // db.collection('room').where({
    //     roomNu: '201'
    //   }).get()
    //   .then(res => console.log(res.data))
    //   .catch(err => console.error(err))

    const db = wx.cloud.database()
    db.collection('house').aggregate()
      .lookup({
        from: 'room',
        localField: '_id',
        foreignField: 'houseId',
        as: 'rooms',
      })
      .end()
      .then(res => console.log(res))
      .catch(err => console.error(err))
  }

})