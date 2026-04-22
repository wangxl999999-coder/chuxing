const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    activeTab: 'booked',
    tabs: [
      { id: 'booked', title: '我预定的' },
      { id: 'published', title: '我发布的' }
    ],
    bookedTrips: [],
    publishedTrips: [],
    loading: false
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    this.loadMyTrips()
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

  loadMyTrips() {
    this.setData({ loading: true })
    
    const app = getApp()
    const userId = app.globalData.userInfo?.id
    
    setTimeout(() => {
      const myTrips = mockData.getMyTrips(userId)
      
      const published = myTrips.published.map(ride => ({
        ...ride,
        formattedDate: util.formatDate(ride.departureTime),
        formattedCreateTime: util.formatTime(new Date(ride.createTime)).full,
        statusText: ride.status === 'active' ? '进行中' : '已完成',
        statusClass: ride.status === 'active' ? 'active' : 'completed'
      }))
      
      const booked = myTrips.booked.map(item => ({
        ...item,
        formattedDate: util.formatDate(item.ride.departureTime),
        formattedBookTime: util.formatTime(new Date(item.bookTime)).full,
        statusText: '已预订',
        statusClass: 'booked'
      }))
      
      this.setData({
        publishedTrips: published,
        bookedTrips: booked,
        loading: false
      })
    }, 500)
  },

  onTabChange(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ activeTab: id })
  },

  onTripTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})
