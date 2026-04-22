const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    rideId: '',
    ride: null,
    userLocation: null,
    bookingSeats: 1,
    maxSeats: 1,
    showSeatPicker: false,
    seatOptions: []
  },

  onLoad(options) {
    this.initData(options)
  },

  initData(options) {
    const { id } = options
    this.setData({ rideId: id })
    
    const app = getApp()
    this.setData({ userLocation: app.globalData.location })
    
    this.loadRideDetail(id)
  },

  loadRideDetail(id) {
    util.showLoading('加载中...')
    
    setTimeout(() => {
      const ride = mockData.getRideById(id)
      
      if (ride) {
        const formattedDate = util.formatDate(ride.departureTime)
        
        let startDistance = '-'
        let endDistance = '-'
        
        if (this.data.userLocation) {
          startDistance = util.calculateDistance(
            this.data.userLocation.latitude,
            this.data.userLocation.longitude,
            ride.start.lat,
            ride.start.lng
          )
          endDistance = util.calculateDistance(
            this.data.userLocation.latitude,
            this.data.userLocation.longitude,
            ride.end.lat,
            ride.end.lng
          )
        }
        
        const maxSeats = ride.availableSeats
        const seatOptions = []
        for (let i = 1; i <= maxSeats; i++) {
          seatOptions.push(i)
        }
        
        this.setData({
          ride: {
            ...ride,
            formattedDate,
            startDistance,
            endDistance
          },
          maxSeats,
          seatOptions
        })
      }
      
      util.hideLoading()
    }, 500)
  },

  onSeatTap() {
    this.setData({ showSeatPicker: true })
  },

  onSeatChange(e) {
    const value = parseInt(e.detail.value)
    this.setData({
      bookingSeats: this.data.seatOptions[value],
      showSeatPicker: false
    })
  },

  onSeatPickerCancel() {
    this.setData({ showSeatPicker: false })
  },

  onContactTap() {
    if (this.data.ride && this.data.ride.publisher.phone) {
      wx.makePhoneCall({
        phoneNumber: this.data.ride.publisher.phone,
        fail: () => {
          util.showToast('无法拨打电话')
        }
      })
    }
  },

  handleBook() {
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
    
    const { ride, bookingSeats } = this.data
    
    util.confirmDialog('确认预订', `确定预订 ${bookingSeats} 个座位吗？\n总费用：¥${ride.fee * bookingSeats}`).then((confirmed) => {
      if (!confirmed) return
      
      wx.navigateTo({
        url: `/pages/pay/pay?id=${ride.id}&seats=${bookingSeats}`
      })
    })
  },

  onShareAppMessage() {
    return {
      title: `从${this.data.ride?.start.name}到${this.data.ride?.end.name}的顺风车`,
      path: `/pages/detail/detail?id=${this.data.rideId}`
    }
  }
})
