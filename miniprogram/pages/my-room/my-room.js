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
    roomList: [],
    editName: '',
    editPhone: ''
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
          this.getRoomList()
        }
      })
      .catch(err => console.error(err))
  },

  /**
   * 获取发布的列表
   */
  getRoomList: function() {
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
  },

  onShow: function() {
    if (app.globalData.reloadMyRoom) {
      this.getRoomList()
      // 设为不刷新页面
      app.globalData.reloadMyRoom = false
    }
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

  nameInput: function(e) {
    this.setData({
      editName: e.detail.value
    })
  },
  phoneInput: function(e) {
    this.setData({
      editPhone: e.detail.value
    })
  },

  /**
   * 提交户主信息
   * 更新数据库
   */
  ownerSubmit: function(e) {
    const db = wx.cloud.database()
    db.collection('user').add({
        data: {
          name: this.data.editName,
          phone: this.data.editPhone
        }
      })
      .then(res => {
        this.setData({
          ownerNormal: false,
          ownerEdit: true,
          ownerDisabled: true,
          ownerRegister: true
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
      })
      .catch(err => {
        console.error(err)
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 2000
        })
      })
  },

  /**
   * 取消户主信息编辑
   * 不可编辑，
   * 回退编辑内容
   */
  ownerCancel: function() {
    this.setData({
      owner: this.data.owner,
      ownerNormal: false,
      ownerEdit: true,
      ownerDisabled: true
    })
  },

})