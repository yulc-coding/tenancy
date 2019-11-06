const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, // 当前页
    pageSize: 10, // 每页显示
    roomList: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.doSearch(false)
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 刷新页面数据
   */
  onPullDownRefresh: function() {
    this.doSearch(true)
  },


  /**
   * 页面上拉触底事件的处理函数
   * 加载更多数据
   */
  onReachBottom: function() {
    var that = this
    wx.showLoading({
      title: '玩命加载中'
    })
    const db = wx.cloud.database()
    // 获取总条数
    db.collection('room').where({
        free: true
      }).count()
      .then(res => {
        const total = res.total
        // 总页数
        const pages = Math.ceil(total / this.data.pageSize)
        // 当前不是最后一页时加载数据
        if (this.data.page < pages) {
          db.collection('room')
            .where({
              free: true
            })
            .skip(this.data.page * this.data.pageSize)
            .limit(this.data.pageSize)
            .get({
              success: (res => {
                console.log(res.data)
                that.setData({
                  roomList: that.data.roomList.concat(res.data),
                  page: that.data.page + 1 // 当前页+1
                })
              }),
              fail: (err => {
                console.error(err)
              }),
              complete: () => {
                wx.hideLoading()
              }
            })
        } else {
          wx.hideLoading()
          console.log("there is no item")
        }

      })
  },


  doSearch: function(isReload) {
    wx.showLoading()
    const db = wx.cloud.database()
    db.collection('room')
      .where({
        free: true
      })
      .skip(0)
      .limit(this.data.pageSize)
      .get({
        success: (res => {
          this.setData({
            roomList: res.data
          })
        }),
        fail: (err => {
          console.error(err)
        }),
        complete: () => {
          wx.hideLoading()
          if (isReload) {
            wx.stopPullDownRefresh() //停止下拉刷新
          }
        }
      })
  }

})