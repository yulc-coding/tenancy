const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: {
      provide: []
    },
    imgList: [],
    provideArr: [false, false, false, false],
    modalShow: '',
    modalContent: '',
    comeBack: true,
    roomId: '' // 新增还是修改
  },


  /**
   * 生命周期函数--监听页面加载
   * 修改操作则从数据库查询信息，并设置页面为修改
   */
  onLoad: function(options) {
    var roomId = options.roomId;
    if (roomId) {
      const db = wx.cloud.database()
      db.collection('room').doc(roomId).get()
        .then(res => {
          this.setData({
            roomId: roomId,
            room: res.data,
            imgList: res.data.pic
          })
        })
        .catch(err => console.error(err))
    }
  },


  /**
   * 调整提供的设施
   */
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


  /**
   * 选择图片
   * 新增时在提交时统一上传、然后提交数据库
   * 跟新时，直接上传并修改数据库
   */
  ChooseImage() {
    wx.chooseImage({
      count: 6, //默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 从相册选择或者拍照
      success: (res) => {
        if (this.data.roomId) {
          this.AddImageForEditRoom(res)
        } else {
          this.AddImageForNewRoom(res)
        }
      }
    });
  },
  /**
   * 本地存放
   */
  AddImageForNewRoom(imageArr) {
    if (this.data.imgList.length != 0) {
      this.setData({
        imgList: this.data.imgList.concat(imageArr.tempFilePaths)
      })
    } else {
      this.setData({
        imgList: imageArr.tempFilePaths
      })
    }
  },
  /**
   * 直接上传
   */
  AddImageForEditRoom(imageArry) {
    wx.showLoading({
      title: '正在上传。。。',
    })
    // 图片数量
    let picNu = imageArry.tempFilePaths.length
    // 上传成功的数量
    let successNu = 0
    imageArry.tempFilePaths.forEach(item => {
      // 将图片上传至云存储空间
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: item.substr(item.lastIndexOf('.', item.lastIndexOf('.') - 1) + 1),
        // 指定要上传的文件的小程序临时文件路径
        filePath: item,
        // 成功回调
        success: res => {
          this.data.imgList.push(res.fileID)
          this.setData({
            imgList: this.data.imgList
          })
          successNu++
          // 全部上传完毕，更新数据库
          if (successNu === picNu) {
            this.updateRoomPic()
          }
        },
        fail: e => {
          picNu--
        }
      })
    })
  },
  /**
   * 删除图片
   * 新增操作，删除列表
   * 修改操作，删除列表并更新数据库
   */
  DelImg(e) {
    wx.showModal({
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          // 修改时，直接删除文件，并跟新数据库
          if (this.data.roomId) {
            this.RemoveImageForEditRoom(e.currentTarget.dataset.index, e.currentTarget.dataset.url)
          } else {
            this.RemoveImageForNewRoom(e.currentTarget.dataset.index)
          }
        }
      }
    })
  },
  RemoveImageForNewRoom(index) {
    this.data.imgList.splice(index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  RemoveImageForEditRoom(index, url) {
    wx.showLoading({
      title: '正在删除。。。',
    })
    wx.cloud.deleteFile({
      fileList: [url],
      success: res => {
        this.data.imgList.splice(index, 1);
        this.setData({
          imgList: this.data.imgList
        })
        this.updateRoomPic()
      },
      fail: err => {
        wx.hideLoading()
        this.setData({
          modalContent: '删除失败',
          modalShow: 'show',
          comeBack: false
        })
      }
    })
  },
  /**
   * 预览
   */
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  /**
   * 更新照片信息
   */
  updateRoomPic() {
    const db = wx.cloud.database()
    db.collection('room').doc(this.data.roomId).update({
      // data 传入需要局部更新的数据
      data: {
        // 只是更新pic字段，其他不更新
        pic: this.data.imgList
      },
      fail: err => {
        this.setData({
          modalContent: '失败',
          modalShow: 'show',
          comeBack: false
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },


  /**
   * 提交表单
   * 新增
   * 修改
   */
  formSubmit: function(e) {
    let room = e.detail.value
    // 赋值提供的设施
    room.provide = this.data.provideArr
    if (this.data.roomId) {
      this.updateRoom(room)
    } else {
      this.newRoom(room)
    }
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
    if (picNu == 0) {
      room.pic = picIds
      this.submitRoom(room)
    }
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
            this.submitRoom(room)
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
    db.collection('room').add({
        data: room
      })
      .then(res => {
        wx.hideLoading()
        this.reloadBackRoom()
        this.setData({
          modalContent: '提交成功',
          modalShow: 'show',
          comeBack: true
        })
      })
      .catch(err => {
        wx.hideLoading()
        this.setData({
          modalContent: '提交失败',
          modalShow: 'show',
          comeBack: false
        })
      })
  },
  /**
   * 更新房源
   */
  updateRoom: function(room) {
    const db = wx.cloud.database()
    db.collection('room').doc(this.data.roomId).update({
      // data 传入需要局部更新的数据
      data: room,
      success: res => {
        this.reloadBackRoom()
        this.setData({
          modalContent: '提交成功',
          modalShow: 'show',
          comeBack: true
        })
      },
      fail: err => {
        this.setData({
          modalContent: '提交失败',
          modalShow: 'show',
          comeBack: false
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  /**
   * 修改信息返回前一个页面时，刷新列表信息
   */
  reloadBackRoom: function() {
    app.globalData.reloadMyRoom = true
  },


  hideModal: function() {
    this.setData({
      modalContent: '',
      modalShow: ''
    })
    if (this.data.comeBack) {
      wx.navigateBack({
        delta: 1
      })
    }
  }

})