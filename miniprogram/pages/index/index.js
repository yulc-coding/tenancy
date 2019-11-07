const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, // 当前页
    pageSize: 10, // 每页显示
    roomList: [],
    bottomLoad: false, // 是否正在上拉加载更多
    noMoreList: false, // 已经没有下一页数据了
    loading: 0 // 当前数据加载百分比
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
    console.log(0)
    // 正在加载中，不处理
    if (this.data.bottomLoad) {
      console.log(1)
      return
    }
    // 已经没有数据了，不处理
    if (this.data.noMoreList) {
      console.log(2)
      return
    }
    console.log(3)
    // 设为正在加载中
    this.setData({
      bottomLoad: true
    })
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
                let loading = Math.ceil((this.data.page + 1) / pages)
                this.setData({
                  roomList: this.data.roomList.concat(res.data),
                  page: this.data.page + 1, // 当前页+1
                  loading: loading
                })
              }),
              fail: (err => {
                console.error(err)
              }),
              complete: () => {
                // 设为加载结束了
                this.setData({
                  bottomLoad: false
                })
                wx.hideLoading()
              }
            })
        } else {
          // 设为记载结束，没有未加载数据了
          this.setData({
            bottomLoad: false,
            noMoreList: true,
            loading: 100
          })
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
            roomList: res.data,
            bottomLoad: false,
            noMoreList: false,
            loading: 0
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