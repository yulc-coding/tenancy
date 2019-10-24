// miniprogram/pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconPath: "../../images/location.png",
    longitude: '',
    latitude: '',
    markers: [{
      id: 1,
      latitude: 30.677245,
      longitude: 121.015116,
      name: 'local'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


})