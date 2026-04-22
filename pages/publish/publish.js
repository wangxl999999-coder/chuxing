const util = require('../../utils/util')
const mockData = require('../../data/mockData')

Page({
  data: {
    start: '',
    startLat: 39.9042,
    startLng: 116.4074,
    end: '',
    endLat: 40.0799,
    endLng: 116.6031,
    date: '',
    time: '',
    dateTime: '',
    seats: 4,
    vehicle: {
      plateNumber: '',
      brand: '',
      model: '',
      color: '',
      seats: 5
    },
    fee: '',
    remark: '',
    agreement: false,
    phone: '',
    showDatePicker: false,
    showTimePicker: false,
    showVehiclePicker: false,
    seatOptions: [1, 2, 3, 4, 5, 6, 7]
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      const userInfo = app.globalData.userInfo
      if (userInfo) {
        this.setData({ phone: userInfo.phone || '' })
      }
    } else {
      util.showToast('请先登录')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 1500)
    }
  },

  initData() {
    const app = getApp()
    const now = new Date()
    
    if (app.globalData.lastPublish) {
      const { start, end } = app.globalData.lastPublish
      this.setData({
        start: start?.name || '',
        startLat: start?.lat || 39.9042,
        startLng: start?.lng || 116.4074,
        end: end?.name || '',
        endLat: end?.lat || 40.0799,
        endLng: end?.lng || 116.6031
      })
    }
    
    const dateStr = now.toISOString().split('T')[0]
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const timeStr = `${util.formatNumber(hours)}:${util.formatNumber(minutes)}`
    
    this.setData({
      date: dateStr,
      time: timeStr,
      dateTime: new Date(dateStr + ' ' + timeStr).toISOString()
    })
    
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ phone: userInfo.phone || '' })
    }
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
        this.setData({
          start: res.name,
          startLat: res.latitude,
          startLng: res.longitude
        })
      }
    })
  },

  onChooseEnd() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          end: res.name,
          endLat: res.latitude,
          endLng: res.longitude
        })
      }
    })
  },

  swapLocation() {
    const { start, end, startLat, startLng, endLat, endLng } = this.data
    this.setData({
      start: end,
      end: start,
      startLat: endLat,
      startLng: endLng,
      endLat: startLat,
      endLng: startLng
    })
  },

  onDateTap() {
    this.setData({ showDatePicker: true })
  },

  onDateChange(e) {
    const value = e.detail.value
    this.setData({
      date: value,
      showDatePicker: false,
      dateTime: new Date(value + ' ' + this.data.time).toISOString()
    })
  },

  onDateCancel() {
    this.setData({ showDatePicker: false })
  },

  onTimeTap() {
    this.setData({ showTimePicker: true })
  },

  onTimeChange(e) {
    const value = e.detail.value
    this.setData({
      time: value,
      showTimePicker: false,
      dateTime: new Date(this.data.date + ' ' + value).toISOString()
    })
  },

  onTimeCancel() {
    this.setData({ showTimePicker: false })
  },

  onSeatsChange(e) {
    const value = parseInt(e.detail.value)
    this.setData({ seats: this.data.seatOptions[value] })
  },

  onFeeInput(e) {
    this.setData({ fee: e.detail.value })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onAgreementChange(e) {
    this.setData({ agreement: e.detail.value })
  },

  onVehicleInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`vehicle.${field}`: value })
  },

  validateForm() {
    const { start, end, date, time, seats, fee, phone, agreement } = this.data
    
    if (!start) {
      util.showToast('请输入出发地')
      return false
    }
    
    if (!end) {
      util.showToast('请输入目的地')
      return false
    }
    
    if (!date) {
      util.showToast('请选择日期')
      return false
    }
    
    if (!time) {
      util.showToast('请选择时间')
      return false
    }
    
    if (!seats <= 0) {
      util.showToast('请选择座位数')
      return false
    }
    
    if (!fee || parseFloat(fee) <= 0) {
      util.showToast('请输入合理的费用')
      return false
    }
    
    if (!phone || phone.length !== 11) {
      util.showToast('请输入正确的手机号')
      return false
    }
    
    if (!agreement) {
      util.showToast('请同意合乘协议')
      return false
    }
    
    return true
  },

  handlePublish() {
    if (!this.validateForm()) return
    
    util.confirmDialog('确认发布', '确定要发布这条拼车信息吗？').then((confirmed) => {
      if (!confirmed) return
      
      util.showLoading('发布中...')
      
      const rideData = {
        start: {
          name: this.data.start,
          lat: this.data.startLat,
          lng: this.data.startLng
        },
        end: {
          name: this.data.end,
          lat: this.data.endLat,
          lng: this.data.endLng
        },
        departureTime: this.data.dateTime,
        seats: this.data.seats,
        vehicle: this.data.vehicle,
        fee: parseFloat(this.data.fee),
        remark: this.data.remark,
        agreement: this.data.agreement,
        phone: this.data.phone
      }
      
      const result = mockData.publishRide(rideData)
      
      const app = getApp()
      app.saveLastPublish({
        start: rideData.start,
        end: rideData.end
      })
      
      setTimeout(() => {
        util.hideLoading()
        util.showToast('发布成功', 'success')
        
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      }, 1000)
    })
  },

  showAgreement() {
    wx.showModal({
      title: '合乘协议',
      content: '1. 合乘出行仅限于上下班途中，车主与乘客之间形成合乘关系，双方应遵守交通规则。\n2. 车主应确保车辆安全，乘客应文明乘车。\n3. 合乘费用为分摊成本，非盈利性质。\n4. 如遇意外，双方应友好协商解决。',
      showCancel: false,
      confirmText: '我已阅读'
    })
  }
})
