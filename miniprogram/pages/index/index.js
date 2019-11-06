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

    wx.showLoading({
      title: '玩命加载中'
    })
    const db = wx.cloud.database()
    // 获取总条数
    db.collection('room').where({
      free: true
    }).count({
      success: function(res) {
        const total = res.total
        // 总页数
        const pages = total % this.data.pageSize == 0 ? Math.floor(total % this.data.pageSize) : Math.ceil(total / this.data.pageSize)
        if (this.page < pages) {
          db.collection('room')
            .where({
              free: true
            })
            .skip(this.page * this.pageSize)
            .limit(this.data.pageSize)
            .get({
              success: (res => {
                this.setData({
                  roomList: this.data.roomList.concat(res.data),
                  page: this.page + 1 // 当前页+1
                })
              }),
              fail: (err => {
                console.error(err)
              }),
              complete: () => {
                wx.hideLoading()
                console.log(this.data.page)
              }
            })
        }
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