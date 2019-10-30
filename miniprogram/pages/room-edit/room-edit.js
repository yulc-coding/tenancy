Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: {
      provide: []
    },
    imgList: [],
    provideArr: [false, false, false, false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var roomId = options.roomId;
    if (roomId) {
      const db = wx.cloud.database()
      db.collection('room').doc(roomId).get()
        .then(res => {
          this.setData({
            room: res.data
          })
        })
        .catch(err => console.error(err))
    }
  },

  checkboxChange: function(e) {
    let ckValue = e.detail.value
    let initCkValue = [false, false, false, false]
    ckValue.forEach(item => {
      initCkValue[item] = true
    })
    this.setData({
      provideArr: initCkValue
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 6, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  /**
   * 提交表单
   */
  formSubmit: function(e) {
    let subRoom = e.detail.value
    subRoom.provide = this.data.provideArr
    console.log(subRoom)
  }
})