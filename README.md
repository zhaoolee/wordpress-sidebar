# 为WordPress网站提供类似GitBook的侧边目录


WordPress是一个很优秀的建站工具, zhaoolee用WordPress建立了自己的博客网站v2fy.com (Way To 方圆) , 对于个人博客而言, GitBook的侧边栏文章目录, 非常适合广大读者阅读, 于是我研究了一下WordPress的开放api接口, 然后写了个工具, 可以使用纯前端的方式, 以WordPress标准Api获取数据, 构建一个类似GitBook的侧边目录;

2022年端午节更新, 用React重写所有逻辑, 新增Input搜索, Loading期间显示Loading标识, 为减少流量消耗, 改为60分钟更新一次数据;

1. 支持手动隐藏显示侧边栏

![支持手动隐藏显示侧边栏](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1653235463455PAsaB4sM.gif)


2. 支持根据屏幕宽度判断显示/隐藏侧边目录(窗口宽度500px及以上显示侧边栏, 500px以下则隐藏侧边栏)

![根据屏幕宽度判断显示/隐藏侧边目录](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1653235464695EZAtZcnf.gif)


3. 侧边栏内容, 支持根据当前网址加深颜色, 并滚动到侧边栏顶部


![支持根据当前网址加深颜色, 并滚动到侧边栏顶部](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1653235468796w4K5P5sr.gif)


4. 支持缓存侧边栏数据, 首次加载后, 侧边栏秒显示, 为了节省流量, 每次打开新页面, 程序会检测时间戳, 过期时间, 侧边栏数据超过10分钟, 才会重新拉取


![支持缓存侧边栏数据](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1653235475702wCPhfHY4.png)


5. 支持通过油猴(Tampermonkey)插件, 为任意WordPress站生成目录


![为任意WordPress站生成目录](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1653235476209R6sf5745.png)

![油猴脚本](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/16532354820301idDbGcJ.png)

```
// ==UserScript==
// @name         wordpress-sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://fangyuanxiaozhan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2fy.com
// @grant        none
// @require       https://v2fy.com/wordpress-sidebar/index.js
// ==/UserScript==
```

## 6. 拉取数据期间显示Loading


![拉取数据期间显示Loading](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1654330998962SG72j4JY.png)


## 7. 添加Input搜索

支持标题搜索, 输入关键词, 即可快速查找包含关键词的标题

![添加Input](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/16543309998301y0pxiTK.gif)

## 8. 字母大小写兼容匹配


![大小写兼容匹配](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1654335756071D8KWZe5f.png)

## WordPress站长使用方法

在页脚插入js脚本即可

![在页脚插入脚本即可](https://raw.githubusercontent.com/zhaoolee/wordpress-sidebar/master/README/1653235482363DGBBTamm.png)

```
<script src="https://www.v2fy.com/wordpress-sidebar/index.js"></script>
```

以上 https://www.v2fy.com/wordpress-sidebar/index.js  不保证稳定, 代码已经在Github开源, 可以从 https://github.com/zhaoolee/wordpress-sidebar  获得最新的脚本代码

