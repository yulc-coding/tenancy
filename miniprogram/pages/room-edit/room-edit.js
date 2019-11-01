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
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 从相册选择或者拍照
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
    let submitRoom = e.detail.value
    submitRoom.provide = this.data.provideArr
    this.newRoom(submitRoom)
  },

  /**
   * 新增房源
   */
  newRoom: function(room) {
    wx.showLoading({
      title: '正在提交。。。',
    })
    let picIds = []
    // 图片数量
    let picNu = this.data.imgList.length
    // 上传成功的数量
    let successNu = 0
    this.data.imgList.forEach((item, index) => {
      // 将图片上传至云存储空间
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: item.substr(item.lastIndexOf('.', item.lastIndexOf('.') - 1) + 1),
        // 指定要上传的文件的小程序临时文件路径
        filePath: item,
        // 成功回调
        success: res => {
          picIds.push(res.fileID)
          successNu++
          // 全部上传完毕，提交表单
          if (successNu === picNu) {
            room.pic = picIds
            console.log(room)
          }
        },
        fail: e => {
          picNu--
        }
      })

    })
  },

  /**
   * 提交房源
   */
  submitRoom: function(room) {

    const db = wx.cloud.database()
    db.collection('room').doc(roomId).get()
      .then(res => {
        this.setData({
          room: res.data
        })
      })
      .then(res => wx.hideLoading())
      .catch(err => console.error(err))
  }

})