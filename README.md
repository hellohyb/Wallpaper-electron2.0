### 技术栈：Vue3、Typescript、vite-electron、tailwindcss、element-plus
当前进度：
✅已完成 windows静态壁纸更换
✅已完成 macos静态壁纸更换
✅已完成 windows动态壁纸更换
✅修复中 windows网页壁纸
✅修复中 macos动态壁纸，网页壁纸
### 技术分析：
#### 1、macOS更换静态壁纸原理
首先把壁纸下载到本地
然后利用如下终端命令修改：
```shell
osascript -e 'tell application "Finder" to set desktop picture to POSIX file "壁纸存放位置"'
```
最后通过node执行终端命令，实现壁纸更换
#### 2、macOS更换动态壁纸原理
动态加载objective-c把窗口放在桌面层，然后生成dylib文件，在electron中利用koffi调用，把窗口句柄传递过去
#### 3、Windows更换壁纸原理：
维护开发中。。。
### 壁纸api
小鸟壁纸、bing每日壁纸

| api名称 | api地址（全为get请求） | 请求参数 |
| --- | --- | --- |
| 获取壁纸分类信息 | http://wp.birdpaper.com.cn/intf/getCategory | 无 |
| 获取每日壁纸（bing） | [https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=${count}&mkt=zh-CN](https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=${count}&mkt=zh-CN) | count：壁纸数量 |
| 根据id获取分类详情 | http://wp.birdpaper.com.cn/intf/GetListByCategory?cids=${cids}&pageno=${pageno}&count=${count} | cids：分类id，pageno：分页数，count：壁纸总量 |
| 搜索壁纸 | http://wp.birdpaper.com.cn/intf/search?content=${key}&pageno=${pageno}&count=1000 | key：搜索内容，pageno：分页，count：数量 |
| 最新壁纸 | http://wp.birdpaper.com.cn/intf/newestList?pageno=1&count=5 | pageno：分页count：返回数量 |

### 成果展示：
视频演示地址：https://www.bilibili.com/video/BV1HZ421t7Xp/

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
