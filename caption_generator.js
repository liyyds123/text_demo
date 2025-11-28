// 图片字幕生成器微信小程序页面
Page({
  data: {
    fileName: '',
    captionText: '别吵\n我在给自己写钓鱼网站呢\n对，这年头\n咱们猫咪都能自己写代码了',
    previewImage: '',
    canSave: false,
    templateIndex: 0,
    templateList: ['无模板', '经典模式', '现代风格', '搞怪风格', '优雅风格', '醒目风格'],
    filterIndex: 0,
    filterList: ['无滤镜', '复古', '怀旧', '黑白', '冷色调', '暖色调'],
    isCollapsed: false,
    originalImage: null,
    tempFilePath: ''
  },

  // 选择图片
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        that.setData({
          fileName: tempFilePath.split('/').pop(),
          tempFilePath: tempFilePath,
          previewImage: tempFilePath,
          canSave: false
        });
        
        // 加载图片到Canvas上下文
        const ctx = wx.createCanvasContext('canvas');
        const img = wx.createImage();
        img.onload = function() {
          that.setData({
            originalImage: img
          });
        };
        img.src = tempFilePath;
      }
    });
  },

  // 字幕文本变化
  onCaptionTextChange(e) {
    this.setData({
      captionText: e.detail.value
    });
  },

  // 模板选择变化
  onTemplateChange(e) {
    this.setData({
      templateIndex: e.detail.value
    });
    // 这里可以添加模板应用逻辑
  },

  // 滤镜选择变化
  onFilterChange(e) {
    this.setData({
      filterIndex: e.detail.value
    });
    // 这里可以添加滤镜应用逻辑
  },

  // 折叠面板切换
  toggleCollapse() {
    this.setData({
      isCollapsed: !this.data.isCollapsed
    });
  },

  // 生成字幕图片
  generateImage() {
    const that = this;
    const { originalImage, captionText } = this.data;
    
    if (!originalImage) {
      wx.showToast({
        title: '请先选择图片！',
        icon: 'none'
      });
      return;
    }
    
    if (!captionText.trim()) {
      wx.showToast({
        title: '请输入字幕文本！',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '生成中...'
    });
    
    setTimeout(() => {
      try {
        const ctx = wx.createCanvasContext('canvas');
        const imgWidth = originalImage.width;
        const imgHeight = originalImage.height;
        
        // 设置Canvas尺寸
        ctx.canvas.width = imgWidth;
        ctx.canvas.height = imgHeight;
        
        // 绘制原图
        ctx.drawImage(originalImage, 0, 0, imgWidth, imgHeight);
        
        // 设置文字样式
        ctx.font = '20px Microsoft YaHei, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#33ccff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // 绘制文字
        const lines = captionText.split('\n');
        const lineHeight = 40;
        const startY = imgHeight - (lines.length * lineHeight) / 2;
        
        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          ctx.strokeText(line, imgWidth / 2, y);
          ctx.fillText(line, imgWidth / 2, y);
        });
        
        // 绘制到Canvas
        ctx.draw(false, () => {
          // 转换为临时文件路径
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            success(res) {
              that.setData({
                previewImage: res.tempFilePath,
                canSave: true
              });
              wx.hideLoading();
            },
            fail(err) {
              console.error('Canvas to temp file failed:', err);
              wx.hideLoading();
              wx.showToast({
                title: '生成失败，请重试',
                icon: 'none'
              });
            }
          });
        });
      } catch (error) {
        console.error('Generate image error:', error);
        wx.hideLoading();
        wx.showToast({
          title: '生成失败，请重试',
          icon: 'none'
        });
      }
    }, 500);
  },

  // AI生成搞笑字幕
  aiGenerateCaption() {
    const that = this;
    const { originalImage } = this.data;
    
    if (!originalImage) {
      wx.showToast({
        title: '请先上传图片！',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: 'AI生成中...'
    });
    
    setTimeout(() => {
      const funnyCaptions = [
        '今天的鱼怎么还没上钩？难道它们也在过周末？',
        '我不是胖，是可爱到膨胀！',
        '别打扰我，我正在思考猫生哲学',
        '今天天气真好，适合睡觉和发呆',
        '为什么人类总是喜欢拍我？难道我是明星？',
        '鱼干在哪里？我闻到了它的味道！',
        '这个盒子看起来不错，我要钻进去',
        '人类的床就是比我的猫窝舒服',
        '为什么我的尾巴总是跟着我？',
        '我不是懒，我是在保存体力',
        '今天的太阳真晒，适合躲在阴凉处',
        '这个玩具一点都不好玩，我要新的！',
        '为什么人类总是要上班？不如陪我玩',
        '我要吃鱼！吃鱼！吃鱼！重要的事情说三遍',
        '别摸我的肚子，我会生气的！',
        '我是一只高贵的猫，才不要理你',
        '这个沙发不错，适合我躺一辈子',
        '为什么我的猫粮总是不够吃？',
        '我要出去！我要看看外面的世界',
        '人类的手机有什么好看的？不如看我',
        '我不是故意打翻杯子的，是杯子先动的手',
        '今天我要当一只安静的美男子',
        '为什么人类总是要洗澡？我讨厌水！',
        '我要睡觉了，别打扰我',
        '这个窗帘真好玩，我要抓它！',
        '我不是贪吃，我是在检查食物是否安全',
        '为什么人类总是要穿衣服？我就不用',
        '今天的风真舒服，适合吹毛',
        '我要爬到最高的地方，看看这个家',
        '别抢我的玩具！这是我的！'
      ];
      
      const randomCaption = funnyCaptions[Math.floor(Math.random() * funnyCaptions.length)];
      that.setData({
        captionText: randomCaption
      });
      
      wx.hideLoading();
    }, 1500);
  },

  // 保存图片
  saveImage() {
    const that = this;
    
    if (!this.data.canSave) {
      wx.showToast({
        title: '请先生成图片！',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '保存中...'
    });
    
    wx.saveImageToPhotosAlbum({
      filePath: this.data.previewImage,
      success() {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功！',
          icon: 'success'
        });
      },
      fail(err) {
        wx.hideLoading();
        console.error('Save image failed:', err);
        
        if (err.errMsg.indexOf('auth deny') > -1) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            confirmText: '去授权',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(settingRes) {
                    if (settingRes.authSetting['scope.writePhotosAlbum']) {
                      that.saveImage();
                    } else {
                      wx.showToast({
                        title: '授权失败，无法保存',
                        icon: 'none'
                      });
                    }
                  }
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: '保存失败，请重试',
            icon: 'none'
          });
        }
      }
    });
  }
});