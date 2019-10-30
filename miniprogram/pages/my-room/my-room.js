const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ownerRegister: false,
    ownerNormal: false,
    ownerEdit: true,
    ownerDisabled: true,
    owner: {
      name: '',
      phone: ''
    },
    roomList: []
  },

  /**
   * 生命周期函数--监听页面加载
   * 获取用户信息
   */
  onLoad: function(options) {
    const db = wx.cloud.database()
    db.collection('user')
      .where({
        _openid: app.globalData.openid
      }).get()
      .then(res => {
        if (res.data.length > 0) {
          this.setData({
            'owner.phone': res.data[0].phone,
            'owner.name': res.data[0].name,
            ownerRegister: true
          })
          console.log('已注册，正在获取已发布信息')
          // 已注册的显示发布的信息
          const db = wx.cloud.database()
          db.collection('room')
            .where({
              _openid: app.globalData.openid
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
      .catch(err => console.error(err))
  },

  /**
   * 编辑户主信息
   */
  ownerEdit: function() {
    this.setData({
      ownerNormal: true,
      ownerEdit: false,
      ownerDisabled: false
    })
  },

  /**
   * 提交户主信息
   */
  ownerSubmit: function(e) {
    this.afterOwnerEdit()
  },

  /**
   * 取消户主信息编辑
   * 不可编辑，
   * 回退编辑内容
   */
  ownerCancel: function() {
    this.afterOwnerEdit()
    this.setData({
      owner: this.data.owner
    })
  },

  /**
   * 编辑之后
   * 设置不可编辑
   * 按钮显示调整
   */
  afterOwnerEdit: function() {
    this.setData({
      ownerNormal: false,
      ownerEdit: true,
      ownerDisabled: true
    })
  },


})