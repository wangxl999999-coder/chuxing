const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    promotionData: null,
    showQRCode: false
  },

  onLoad() {
    this.checkLogin()
    this.loadPromotionData()
  },

  checkLogin() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      util.showToast('请先登录')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 1500)
    }
  },

  loadPromotionData() {
    util.showLoading('加载中...')
    
    setTimeout(() => {
      const data = mockData.getPromotionData()
      this.setData({ promotionData: data })
      util.hideLoading()
    }, 500)
  },

  onShowQRCode() {
    this.setData({ showQRCode: true })
  },

  onHideQRCode() {
    this.setData({ showQRCode: false })
  },

  onShareTap() {
    util.showToast('请点击右上角分享')
  },

  onWithdrawTap() {
    util.confirmDialog('提现', `确定要提现 ¥${this.data.promotionData.totalCommission} 吗？`).then((confirmed) => {
      if (confirmed) {
        util.showToast('提现申请已提交', 'success')
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '快来一起用顺风车，出行更省钱！',
      path: '/pages/index/index',
      imageUrl: 'https://placehold.co/500x400/1890ff/FFFFFF?text=顺风车出行'
    }
  },

  onShareTimeline() {
    return {
      title: '顺风车 - 便捷出行，绿色共享',
      imageUrl: 'https://placehold.co/500x400/1890ff/FFFFFF?text=顺风车出行'
    }
  }
})
