// miniprogram/pages/fee_house/fee-house.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.doSearch()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.doSearch()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  doSearch: function() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('house')
      .where({
        freeNu: _.gt(0)
      })
      .get()
      .then(res => {
        this.setData({
          freeList: res.data
        })
        //console.log(res.data[0].location.latitude)
      })
      .catch(err => console.error(err))
  }

})