const util = require('../utils/util')

const mockUsers = [
  {
    id: 'user1',
    nickname: '顺风车主小王',
    phone: '13800138001',
    avatar: 'https://placehold.co/100x100/1890ff/FFFFFF?text=王',
    vehicle: {
      plateNumber: '京A12345',
      brand: '大众',
      model: '朗逸',
      color: '白色',
      seats: 5
    }
  },
  {
    id: 'user2',
    nickname: '滴滴李师傅',
    phone: '13800138002',
    avatar: 'https://placehold.co/100x100/52c41a/FFFFFF?text=李',
    vehicle: {
      plateNumber: '沪B67890',
      brand: '丰田',
      model: '卡罗拉',
      color: '黑色',
      seats: 5
    }
  },
  {
    id: 'user3',
    nickname: '顺风美女车主',
    phone: '13800138003',
    avatar: 'https://placehold.co/100x100/eb2f96/FFFFFF?text=女',
    vehicle: {
      plateNumber: '粤C11111',
      brand: '宝马',
      model: '3系',
      color: '红色',
      seats: 5
    }
  }
]

const generateMockRides = () => {
  const now = new Date()
  const rides = []
  
  const locations = [
    { name: '北京西站', lat: 39.9042, lng: 116.4074 },
    { name: '北京南站', lat: 39.8654, lng: 116.3784 },
    { name: '北京东站', lat: 39.9047, lng: 116.4646 },
    { name: '北京朝阳站', lat: 39.9614, lng: 116.5861 },
    { name: '首都机场', lat: 40.0799, lng: 116.6031 },
    { name: '大兴机场', lat: 39.5081, lng: 116.4217 },
    { name: '中关村', lat: 39.9831, lng: 116.3072 },
    { name: '国贸', lat: 39.9087, lng: 116.4605 },
    { name: '五道口', lat: 39.9999, lng: 116.3464 },
    { name: '望京', lat: 40.0041, lng: 116.4821 }
  ]
  
  for (let i = 0; i < 15; i++) {
    const startIdx1 = Math.floor(Math.random() * locations.length)
    let endIdx1 = Math.floor(Math.random() * locations.length)
    while (endIdx1 === startIdx1) {
      endIdx1 = Math.floor(Math.random() * locations.length)
    }
    
    const start = locations[startIdx1]
    const end = locations[endIdx1]
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const hoursLater = Math.floor(Math.random() * 48)
    const departureTime = new Date(now.getTime() + hoursLater * 60 * 60 * 1000)
    
    rides.push({
      id: 'ride_' + util.generateId(),
      publisherId: user.id,
      publisher: {
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone
      },
      start: {
        name: start.name,
        lat: start.lat,
        lng: start.lng
      },
      end: {
        name: end.name,
        lat: end.lat,
        lng: end.lng
      },
      departureTime: departureTime.toISOString(),
      seats: 5,
      availableSeats: Math.floor(Math.random() * 4) + 1,
      vehicle: user.vehicle,
      fee: Math.floor(Math.random() * 100) + 30,
      remark: ['可带行李', '准时出发', '舒适出行', '顺路接人'][Math.floor(Math.random() * 4)],
      agreement: '同意合乘协议',
      status: 'active',
      createTime: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return rides.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime))
}

const popularRoutes = [
  { start: '北京西站', end: '首都机场', count: 128 },
  { start: '北京南站', end: '大兴机场', count: 96 },
  { start: '中关村', end: '国贸', count: 85 },
  { start: '五道口', end: '望京', count: 72 },
  { start: '北京东站', end: '首都机场', count: 65 },
  { start: '朝阳站', end: '大兴机场', count: 58 }
]

const promotionData = {
  totalCommission: 1258.5,
  totalOrders: 32,
  inviteCount: 15,
  todayIncome: 56.8,
  qrcode: 'https://placehold.co/200x200/000000/FFFFFF?text=QR',
  history: [
    { date: '2024-01-15', user: '张三', commission: 25.5, orderCount: 3 },
    { date: '2024-01-14', user: '李四', commission: 18.0, orderCount: 2 },
    { date: '2024-01-13', user: '王五', commission: 32.0, orderCount: 4 }
  ]
}

const helpData = [
  {
    question: '如何发布拼车信息？',
    answer: '点击底部"发布"按钮，填写出发地、目的地、出发时间等信息，确认无误后点击发布即可。'
  },
  {
    question: '如何预定拼车？',
    answer: '在首页搜索或选择热门路线，找到合适的拼车信息，点击"预定"按钮，按照提示完成支付即可。'
  },
  {
    question: '如何查看我的行程？',
    answer: '点击底部"我的"页面，选择"我的行程"即可查看您发布和预定的所有行程记录。'
  },
  {
    question: '如何联系车主？',
    answer: '在行程详情页面可以查看车主的联系方式，也可以通过聊天功能与车主沟通。'
  },
  {
    question: '支付后可以取消吗？',
    answer: '出发前24小时可申请取消，全额退款；出发前12小时内取消需收取20%手续费；出发前2小时内取消需收取50%手续费。'
  }
]

let ridesCache = null

const getRides = (filters = {}) => {
  if (!ridesCache) {
    ridesCache = generateMockRides()
  }
  
  let result = [...ridesCache].filter(ride => ride.status === 'active')
  
  if (filters.start) {
    result = result.filter(ride => 
      ride.start.name.includes(filters.start)
    )
  }
  
  if (filters.end) {
    result = result.filter(ride => 
      ride.end.name.includes(filters.end)
    )
  }
  
  if (filters.date) {
    result = result.filter(ride => {
      const rideDate = new Date(ride.departureTime).toDateString()
      const filterDate = new Date(filters.date).toDateString()
      return rideDate === filterDate
    })
  }
  
  return result
}

const getRideById = (id) => {
  if (!ridesCache) {
    ridesCache = generateMockRides()
  }
  return ridesCache.find(ride => ride.id === id)
}

const publishRide = (rideData) => {
  if (!ridesCache) {
    ridesCache = generateMockRides()
  }
  
  const app = getApp()
  const userInfo = app.globalData.userInfo
  
  const newRide = {
    id: 'ride_' + util.generateId(),
    publisherId: userInfo.id,
    publisher: {
      nickname: userInfo.nickname,
      avatar: userInfo.avatar,
      phone: userInfo.phone
    },
    start: rideData.start,
    end: rideData.end,
    departureTime: rideData.departureTime,
    seats: rideData.seats,
    availableSeats: rideData.seats,
    vehicle: rideData.vehicle,
    fee: rideData.fee,
    remark: rideData.remark,
    agreement: rideData.agreement,
    status: 'active',
    createTime: new Date().toISOString()
  }
  
  ridesCache.unshift(newRide)
  return newRide
}

const getPopularRoutes = () => {
  return popularRoutes
}

const getRecentSearches = () => {
  const recent = wx.getStorageSync('recentSearches') || []
  return recent
}

const addRecentSearch = (start, end) => {
  let recent = wx.getStorageSync('recentSearches') || []
  const item = { start, end, time: Date.now() }
  
  const existIndex = recent.findIndex(r => r.start === start && r.end === end)
  if (existIndex > -1) {
    recent.splice(existIndex, 1)
  }
  
  recent.unshift(item)
  
  if (recent.length > 10) {
    recent = recent.slice(0, 10)
  }
  
  wx.setStorageSync('recentSearches', recent)
}

const getMyTrips = (userId) => {
  if (!ridesCache) {
    ridesCache = generateMockRides()
  }
  
  const published = ridesCache.filter(ride => ride.publisherId === userId)
  const booked = wx.getStorageSync('bookedRides') || []
  
  return {
    published,
    booked
  }
}

const bookRide = (rideId, seats = 1) => {
  const ride = getRideById(rideId)
  if (ride) {
    ride.availableSeats -= seats
    
    const bookedRides = wx.getStorageSync('bookedRides') || []
    bookedRides.push({
      rideId,
      seats,
      status: 'booked',
      bookTime: new Date().toISOString(),
      ride
    })
    wx.setStorageSync('bookedRides', bookedRides)
    
    return true
  }
  return false
}

const getPromotionData = () => {
  return promotionData
}

const getHelpData = () => {
  return helpData
}

module.exports = {
  getRides,
  getRideById,
  publishRide,
  getPopularRoutes,
  getRecentSearches,
  addRecentSearch,
  getMyTrips,
  bookRide,
  getPromotionData,
  getHelpData
}
