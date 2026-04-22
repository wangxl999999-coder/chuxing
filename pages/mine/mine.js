const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    menuItems: [
      {
        id: 'trips',
        icon: '📋',
        title: '我的行程',
        desc: '查看发布和预定的行程',
        path: '/pages/my-trips/my-trips'
      },
      {
        id: 'vehicle',
        icon: '🚗',
        title: '车辆信息',
        desc: '管理您的车辆信息',
        path: '/pages/vehicle-info/vehicle-info'
      },
      {
        id: 'promotion',
        icon: '🎁',
        title: '推广中心',
        desc: '分享赚钱',
        path: '/pages/promotion/promotion'
      },
      {
        id: 'help',
        icon: '❓',
        title: '帮助中心',
        desc: '常见问题解答',
        path: '/pages/help/help'
      }
    ]
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      isLoggedIn: app.globalData.isLoggedIn
    })
  },

  onAvatarTap() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  onMenuTap(e) {
    const { path } = e.currentTarget.dataset
    
    if (this.data.isLoggedIn) {
      wx.navigateTo({
        url: path
      })
    } else {
      util.showToast('请先登录')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 1500)
    }
  },

  onLogoutTap() {
    util.confirmDialog('退出登录', '确定要退出登录吗？').then((confirmed) => {
      if (confirmed) {
        const app = getApp()
        app.logout()
        this.setData({
          userInfo: null,
          isLoggedIn: false
        })
        util.showToast('已退出登录', 'success')
      }
    })
  }
})
