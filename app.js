App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    location: null,
    lastPublish: null
  },

  onLaunch() {
    this.checkLoginStatus()
    this.getLocation()
    this.loadLastPublish()
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
    }
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
      }
    })
  },

  loadLastPublish() {
    const lastPublish = wx.getStorageSync('lastPublish')
    if (lastPublish) {
      this.globalData.lastPublish = lastPublish
    }
  },

  saveLastPublish(data) {
    this.globalData.lastPublish = {
      start: data.start,
      end: data.end
    }
    wx.setStorageSync('lastPublish', this.globalData.lastPublish)
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = true
    wx.setStorageSync('userInfo', userInfo)
  },

  logout() {
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    wx.removeStorageSync('userInfo')
  }
})
