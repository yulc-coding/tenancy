//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomList: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.doSearch()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 刷新页面数据
   */
  onPullDownRefresh: function () {
    this.doSearch()
  },


  /**
   * 页面上拉触底事件的处理函数
   * 加载更多数据
   */
  onReachBottom: function () {

  },


  doSearch: function () {
    const db = wx.cloud.database()
    db.collection('room')
      .where({
        free: true
      })
      .get()
      .then(res => {
        this.setData({
          roomList: res.data
        })
      })
      .catch(err => console.error(err))
  }

})