const util = require('../../utils/util')

Page({
  data: {
    vehicle: {
      plateNumber: '',
      brand: '',
      model: '',
      color: '',
      seats: 5,
      ownerName: '',
      ownerIdCard: ''
    },
    isEdit: false,
    seatOptions: [2, 4, 5, 6, 7, 8]
  },

  onLoad() {
    this.checkLogin()
    this.loadVehicleInfo()
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

  loadVehicleInfo() {
    const vehicle = wx.getStorageSync('vehicleInfo')
    if (vehicle) {
      this.setData({ vehicle })
    }
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`vehicle.${field}`]: value
    })
  },

  onSeatsChange(e) {
    const value = parseInt(e.detail.value)
    this.setData({
      'vehicle.seats': this.data.seatOptions[value]
    })
  },

  onEditTap() {
    this.setData({ isEdit: !this.data.isEdit })
  },

  validateForm() {
    const { plateNumber, brand, model, color } = this.data.vehicle
    
    if (!plateNumber) {
      util.showToast('请输入车牌号')
      return false
    }
    
    if (!brand) {
      util.showToast('请输入车辆品牌')
      return false
    }
    
    if (!model) {
      util.showToast('请输入车辆型号')
      return false
    }
    
    if (!color) {
      util.showToast('请输入车辆颜色')
      return false
    }
    
    return true
  },

  handleSave() {
    if (!this.validateForm()) return
    
    wx.setStorageSync('vehicleInfo', this.data.vehicle)
    
    util.showToast('保存成功', 'success')
    
    this.setData({ isEdit: false })
  }
})
