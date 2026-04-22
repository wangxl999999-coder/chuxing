const util = require('../../utils/util')

Page({
  data: {
    phone: '',
    password: '',
    isRegister: false,
    code: '',
    codeText: '获取验证码',
    countDown: 0
  },

  onLoad(options) {
    if (options.register) {
      this.setData({ isRegister: true })
    }
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value })
  },

  getCode() {
    const { phone, countDown } = this.data
    
    if (countDown > 0) return
    
    if (!phone || phone.length !== 11) {
      util.showToast('请输入正确的手机号')
      return
    }
    
    this.setData({ countDown: 60 })
    
    util.showToast('验证码已发送')
    
    const timer = setInterval(() => {
      const countDown = this.data.countDown - 1
      if (countDown <= 0) {
        clearInterval(timer)
        this.setData({ countDown: 0, codeText: '获取验证码' })
      } else {
        this.setData({ countDown, codeText: `${countDown}s` })
      }
    }, 1000)
  },

  toggleMode() {
    this.setData({ isRegister: !this.data.isRegister })
  },

  handleLogin() {
    const { phone, password } = this.data
    
    if (!phone || phone.length !== 11) {
      util.showToast('请输入正确的手机号')
      return
    }
    
    if (!password) {
      util.showToast('请输入密码')
      return
    }
    
    util.showLoading('登录中...')
    
    setTimeout(() => {
      util.hideLoading()
      
      const userInfo = {
        id: 'user_' + util.generateId(),
        phone: phone,
        nickname: '用户' + phone.slice(-4),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20simple%20circle&image_size=square'
      }
      
      const app = getApp()
      app.setUserInfo(userInfo)
      
      util.showToast('登录成功', 'success')
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
    }, 1000)
  },

  handleRegister() {
    const { phone, password, code } = this.data
    
    if (!phone || phone.length !== 11) {
      util.showToast('请输入正确的手机号')
      return
    }
    
    if (!code) {
      util.showToast('请输入验证码')
      return
    }
    
    if (!password || password.length < 6) {
      util.showToast('密码至少6位')
      return
    }
    
    util.showLoading('注册中...')
    
    setTimeout(() => {
      util.hideLoading()
      
      const userInfo = {
        id: 'user_' + util.generateId(),
        phone: phone,
        nickname: '用户' + phone.slice(-4),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20simple%20circle&image_size=square'
      }
      
      const app = getApp()
      app.setUserInfo(userInfo)
      
      util.showToast('注册成功', 'success')
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
    }, 1000)
  },

  handleSubmit() {
    if (this.data.isRegister) {
      this.handleRegister()
    } else {
      this.handleLogin()
    }
  },

  onGotUserInfo(e) {
    if (e.detail.userInfo) {
      console.log('用户信息:', e.detail.userInfo)
    }
  }
})
