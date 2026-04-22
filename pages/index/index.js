const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    start: '',
    end: '',
    date: '',
    dateText: '今天',
    recentSearches: [],
    popularRoutes: [],
    showDatePicker: false
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.loadRecentSearches()
  },

  initData() {
    const popularRoutes = mockData.getPopularRoutes()
    this.setData({ popularRoutes })
    this.loadRecentSearches()
    this.setDefaultDate()
  },

  loadRecentSearches() {
    const recentSearches = mockData.getRecentSearches()
    const formatted = recentSearches.map(item => {
      let formattedDate = ''
      if (item.time) {
        formattedDate = util.formatTime(new Date(item.time)).date
      }
      return {
        ...item,
        formattedDate
      }
    })
    this.setData({ recentSearches: formatted })
  },

  setDefaultDate() {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    this.setData({
      date: dateStr,
      dateText: '今天'
    })
  },

  onStartInput(e) {
    this.setData({ start: e.detail.value })
  },

  onEndInput(e) {
    this.setData({ end: e.detail.value })
  },

  onChooseLocation(e) {
    const type = e.currentTarget.dataset.type
    wx.chooseLocation({
      success: (res) => {
        if (type === 'start') {
          this.setData({ start: res.name })
        } else {
          this.setData({ end: res.name })
        }
      }
    })
  },

  swapLocation() {
    const { start, end } = this.data
    this.setData({
      start: end,
      end: start
    })
  },

  onDateTap() {
    this.setData({ showDatePicker: true })
  },

  onDateChange(e) {
    const value = e.detail.value
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    
    let dateText = value
    if (value === today) {
      dateText = '今天'
    } else if (value === tomorrow) {
      dateText = '明天'
    }
    
    this.setData({
      date: value,
      dateText,
      showDatePicker: false
    })
  },

  onDatePickerCancel() {
    this.setData({ showDatePicker: false })
  },

  handleSearch() {
    const { start, end, date } = this.data
    
    if (!start) {
      util.showToast('请输入出发地')
      return
    }
    
    if (!end) {
      util.showToast('请输入目的地')
      return
    }
    
    mockData.addRecentSearch(start, end)
    
    wx.navigateTo({
      url: `/pages/list/list?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&date=${date}`
    })
  },

  onQuickSearch(e) {
    const { start, end } = e.currentTarget.dataset
    
    mockData.addRecentSearch(start, end)
    
    wx.navigateTo({
      url: `/pages/list/list?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    })
  },

  clearRecentSearches() {
    util.confirmDialog('提示', '确定要清空历史搜索吗？').then((confirmed) => {
      if (confirmed) {
        wx.removeStorageSync('recentSearches')
        this.setData({ recentSearches: [] })
        util.showToast('已清空')
      }
    })
  }
})
