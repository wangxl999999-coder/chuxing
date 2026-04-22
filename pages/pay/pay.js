const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    rideId: '',
    seats: 1,
    ride: null,
    totalAmount: 0,
    payMethod: 'wechat',
    paying: false,
    showResult: false,
    paySuccess: false
  },

  onLoad(options) {
    this.initData(options)
  },

  initData(options) {
    const { id, seats } = options
    this.setData({
      rideId: id,
      seats: parseInt(seats)
    })
    
    this.loadRideDetail(id)
  },

  loadRideDetail(id) {
    util.showLoading('加载中...')
    
    setTimeout(() => {
      const ride = mockData.getRideById(id)
      
      if (ride) {
        const formattedDate = util.formatDate(ride.departureTime)
        
        this.setData({
          ride: {
            ...ride,
            formattedDate
          },
          totalAmount: ride.fee * this.data.seats
        })
      }
      
      util.hideLoading()
    }, 500)
  },

  onPayMethodChange(e) {
    const method = e.currentTarget.dataset.method
    this.setData({ payMethod: method })
  },

  handlePay() {
    const app = getApp()
    
    if (!app.globalData.isLoggedIn) {
      util.showToast('请先登录')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 1500)
      return
    }
    
    util.confirmDialog('确认支付', `确认支付 ¥${this.data.totalAmount} 吗？`).then((confirmed) => {
      if (!confirmed) return
      
      this.setData({ paying: true })
      util.showLoading('支付中...')
      
      setTimeout(() => {
        const result = mockData.bookRide(this.data.rideId, this.data.seats)
        
        util.hideLoading()
        this.setData({ 
          paying: false,
          showResult: true,
          paySuccess: result
        })
        
        if (result) {
          util.showToast('支付成功', 'success')
        } else {
          util.showToast('支付失败，请重试')
        }
      }, 2000)
    })
  },

  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  viewMyTrips() {
    wx.redirectTo({
      url: '/pages/my-trips/my-trips'
    })
  }
})
