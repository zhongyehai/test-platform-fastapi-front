## 基于 vue-admin-template 开发测试平台前端

### 线上预览：http://139.196.100.202/#/login  账号：admin、密码：123456，请不要修改密码

### 系统操作手册：[gitee](https://gitee.com/Xiang-Qian-Zou/api-test-api/blob/master/%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.md) ，[github](https://github.com/zhongyehai/api-test-api/blob/main/%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.md)

### 后端传送门：https://github.com/zhongyehai/test-platform-fastapi-api

## 步骤

```bash
# 1.安装node14.x（一定要控制在14.x，版本太高会出一系列幺蛾子），确保在 cmd 下 node -v 能出现版本号
# 2.克隆并进入项目目录
# 3.安装依赖
npm install --registry=https://registry.npm.taobao.org

# 4.启动服务
npm run dev

# 5.打包部署到生产
npm run build
```

浏览器访问 [http://localhost:8023](http://localhost:8023), 账号admin, 密码123456

## 项目关键截图

#### 选择运行环境

![选择运行环境](img/case/选择运行环境.png)

#### 测试执行进度

![用例执行进度](img/case/测试执行进度.png)

#### 测试报告

![测试报告](img/report/测试报告.png)
