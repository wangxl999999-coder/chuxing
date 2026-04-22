const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    helpList: [],
    expandedIndex: -1
  },

  onLoad() {
    this.loadHelpData()
  },

  loadHelpData() {
    const helpData = mockData.getHelpData()
    this.setData({ helpList: helpData })
  },

  onItemTap(e) {
    const { index } = e.currentTarget.dataset
    const currentIndex = this.data.expandedIndex
    
    if (currentIndex === index) {
      this.setData({ expandedIndex: -1 })
    } else {
      this.setData({ expandedIndex: index })
    }
  },

  onContactTap() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567',
      fail: () => {
        util.showToast('无法拨打电话')
      }
    })
  },

  onFeedbackTap() {
    util.showToast('意见反馈功能开发中')
  }
})
