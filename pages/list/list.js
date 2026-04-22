const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    start: '',
    end: '',
    date: '',
    rides: [],
    loading: false,
    userLocation: null
  },

  onLoad(options) {
    this.initData(options)
  },

  onShow() {
    this.loadRides()
  },

  initData(options) {
    const { start, end, date } = options
    const today = new Date().toISOString().split('T')[0]
    
    this.setData({
      start: start ? decodeURIComponent(start) : '',
      end: end ? decodeURIComponent(end) : '',
      date: date || today
    })
    
    const app = getApp()
    this.setData({ userLocation: app.globalData.location })
    
    this.loadRides()
  },

  loadRides() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const { start, end, date, userLocation } = this.data
      
      let filters = {}
      if (start) filters.start = start
      if (end) filters.end = end
      if (date) filters.date = date
      
      let rides = mockData.getRides(filters)
      
      rides = rides.map(ride => {
        const formattedDate = util.formatDate(ride.departureTime)
        
        let startDistance = '-'
        let endDistance = '-'
        
        if (userLocation) {
          startDistance = util.calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            ride.start.lat, 
            ride.start.lng
          )
          endDistance = util.calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            ride.end.lat, 
            ride.end.lng
          )
        }
        
        return {
          ...ride,
          formattedDate,
          startDistance,
          endDistance
        }
      })
      
      this.setData({ 
        rides,
        loading: false
      })
    }, 500)
  },

  onStartInput(e) {
    this.setData({ start: e.detail.value })
  },

  onEndInput(e) {
    this.setData({ end: e.detail.value })
  },

  onChooseStart() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ start: res.name })
      }
    })
  },

  onChooseEnd() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ end: res.name })
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
    wx.showModal({
      title: '选择日期',
      content: '暂支持今天和明天',
      showCancel: false
    })
  },

  handleSearch() {
    const { start, end } = this.data
    
    if (!start && !end) {
      util.showToast('请输入出发地或目的地')
      return
    }
    
    this.loadRides()
  },

  onRideTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  onBookTap(e) {
    e.stopPropagation()
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  onPullDownRefresh() {
    this.loadRides()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
