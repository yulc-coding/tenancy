const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ownerNormal: false,
    ownerEdit: true,
    ownerDisabled: true,
    nickName: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nickName: app.globalData.nickName,
      phone: app.globalData.phone
    })

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
   * 不可编辑，回退编辑内容
   */
  ownerCancel: function() {
    this.afterOwnerEdit()
    this.setData({
      nickName: app.globalData.nickName,
      phone: app.globalData.phone
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
  }

})