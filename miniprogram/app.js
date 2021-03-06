App({
  onLaunch: function () {
    this.getSystemInfo();
    // 展示本地存储能力
    wx.hideTabBar();
    var logs = wx.getStorageSync('logs')
    //logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    console.log("app run function onlaunch")
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }
    else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.cloud.init({
      env: 'ardec-63ac9b', traceUser: true
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId，
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    var that = this
    that.getOpenid();
    console.log(that.globalData.openid)
  },

  onShow: function () {
    wx.hideTabBar();
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  ///////////////全局获得openid/////////////

  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid', complete: res => {
        var openid = res.result.openId;
        this.globalData.openid = openid
        console.log(this.globalData.openid)
        const db = wx.cloud.database();
        db.collection('userAll')
          .where({
            _openid: openid
          })
          .get({
            success: res => {
              let user = res.data;
              console.log(user[0])
              this.globalData.stuId = user[0].id
              this.globalData.stuname = user[0].name
            }
          })
      }
    })

  },

  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    systemInfo: null,//客户端设备信息
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/Square/Square",
          "iconPath": "/tabbarComponent/icon/icon_home.png",
          "selectedIconPath": "/tabbarComponent/icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/raise/raise",
          "iconPath": "/tabbarComponent/icon/icon_release.png",
          "isSpecial": true
          
        },
        {
          "pagePath": "/pages/usercenter/usercenter",
          "iconPath": "/tabbarComponent/icon/icon_mine.png",
          "selectedIconPath": "/tabbarComponent/icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    },



    userInfo: null,
    stuId: '',
    stuname: '',
    openid: '',
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  }
})