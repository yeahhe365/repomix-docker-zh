# 本地部署（Docker）

这个 fork 主要面向 **本地部署** 和 **本地代码目录处理**。

如果你想要：

- 使用中文 Web UI
- 在浏览器里直接浏览本地目录并选择路径
- 让前端记住上次使用的模式、路径和目录位置
- 通过 Docker 快速启动前后端

那么推荐使用本页介绍的方式，而不是官方线上站点。

## 适用场景

适合以下场景：

- 仅在自己的电脑上使用
- 需要处理本地绝对路径，例如 `/Users/jones/Documents/Code/project`
- 希望通过 Web UI 操作，但不想把代码上传到第三方服务

默认 Docker 配置只监听 `127.0.0.1`。如果你要开放给局域网访问，请先增加访问控制，并确认允许目录足够收敛。

## 快速启动

在仓库根目录运行：

```bash
docker compose -f website/compose.docker.yml up --build
```

启动后可访问：

- 前端：`http://localhost:5173`
- 后端健康检查：`http://localhost:8080/health`

## 当前 Docker 配置

本地部署配置默认启用了以下能力：

- `ENABLE_LOCAL_PATH_MODE=true`
- `LOCAL_PATH_ALLOWLIST=/Users`
- 端口绑定：`127.0.0.1:5173:80`、`127.0.0.1:8080:8080`
- 宿主机目录挂载：`/Users:/Users:ro`

这意味着：

- Web UI 可以浏览 `/Users` 下面的目录
- 后端只能读取允许目录中的内容
- 前后端默认只允许本机访问
- 读取方式是只读挂载，不会修改宿主机文件

## 本地目录选择

在首页切换到“本地路径”模式后，你可以：

1. 点击“浏览”
2. 从允许访问的目录开始逐级进入
3. 搜索当前目录中的文件夹
4. 直接使用“最近访问”快速回到之前的位置
5. 选择当前文件夹，把绝对路径回填到输入框

## 状态持久化

页面会自动记住这些状态：

- 当前页签
- URL 输入框内容
- 本地路径输入框内容
- 打包选项
- 本地目录浏览器的当前位置
- 选中的目录
- 列表滚动位置
- 最近访问目录

刷新页面后会自动恢复。

## 常见问题

### 1. 目录浏览时提示 rate limit exceeded

这个问题在当前 fork 中已经修复。
如果你还看到旧报错，请重新拉取最新代码并执行：

```bash
docker compose -f website/compose.docker.yml up --build -d
```

### 2. 为什么不能拖入文件夹后自动得到真实绝对路径？

因为纯浏览器页面拿不到宿主机的真实绝对路径，这是浏览器安全限制。
当前 fork 采用的是“后端目录浏览器选路径”的方案。

### 3. 为什么文件上传模式不能恢复上次上传的文件？

浏览器不会安全地自动恢复本地文件对象。
因此当前 fork 只会记住页签和其他状态，不会恢复上传文件本体。

## 自定义允许目录

如果你不想只允许 `/Users`，可以修改 `website/compose.docker.yml`：

```yaml
environment:
  - ENABLE_LOCAL_PATH_MODE=true
  - LOCAL_PATH_ALLOWLIST=/Users,/Volumes/Work
volumes:
  - /Users:/Users:ro
  - /Volumes/Work:/Volumes/Work:ro
```

注意：`LOCAL_PATH_ALLOWLIST` 和 Docker `volumes` 挂载范围要保持一致。

## 安全建议

这个本地路径模式是为 **本地可信部署** 设计的。

建议：

- 仅在本机或可信内网中使用
- 如果需要内网访问，请先加反向代理认证或其他访问控制
- 不要直接暴露到公网
- 不要把允许目录设得过宽

## 相关页面

- [安装](./installation)
- [基本用法](./usage)
- [配置](./configuration)
- [安全性](./security)
