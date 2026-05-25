# 那个夏天 - 电子同学录

✨ 高三X班的青春纪念册

## 📸 功能特色

- 🏠 **首页** - 班级信息展示、统计数据
- 👤 **同学录** - 每位同学的个人主页，支持留言
- 💬 **留言墙** - 同学间互相留言、点赞
- 📸 **照片墙** - 上传和展示班级照片
- 🎯 **弹幕墙** - 毕业聚会投屏互动
- 💊 **时间胶囊** - 写给未来的信，设定打开日期

## 🚀 快速开始

### 方案一：本地预览（最简单）

1. 双击打开 `index.html` 即可预览
2. 使用模拟数据，无需配置

### 方案二：部署到线上（推荐）

#### 第一步：注册 Supabase（免费）

1. 访问 https://supabase.com
2. 点击 "Start your project" 注册账号
3. 创建新项目：
   - Project name: `classmate-book`
   - Database Password: 设置一个密码（记住它）
   - Region: 选择 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`
4. 等待项目创建完成（约2分钟）

#### 第二步：创建数据库表

进入 SQL Editor，依次执行以下 SQL：

```sql
-- 创建学生表
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '😊',
    avatar_url TEXT,
    motto TEXT,
    zodiac TEXT,
    hobbies TEXT,
    university TEXT,
    wechat TEXT,
    tags TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建留言表
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建个人留言表
CREATE TABLE profile_messages (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建照片表
CREATE TABLE photos (
    id BIGSERIAL PRIMARY KEY,
    url TEXT,
    emoji TEXT DEFAULT '📷',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建时间胶囊表
CREATE TABLE capsules (
    id BIGSERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    open_date DATE NOT NULL,
    is_opened BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用实时功能
ALTER TABLE students REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE profile_messages REPLICA IDENTITY FULL;
ALTER TABLE photos REPLICA IDENTITY FULL;
ALTER TABLE capsules REPLICA IDENTITY FULL;
```

#### 第三步：创建存储桶（用于照片上传）

1. 左侧菜单点击 "Storage"
2. 点击 "Create a new bucket"
3. 填写：
   - Name: `photos`
   - Public bucket: ✅ 勾选
4. 点击 "Create bucket"

#### 第四步：获取 API 密钥

1. 左侧菜单点击 "Settings" → "API"
2. 复制以下两个值：
   - **Project URL**: 类似 `https://xxxx.supabase.co`
   - **anon public key**: 类似 `eyJxxxx...`

#### 第五步：配置项目

编辑 `js/config.js` 文件：

```javascript
const CONFIG = {
    SUPABASE_URL: '你的 Project URL',
    SUPABASE_ANON_KEY: '你的 anon public key',
    // ... 其他配置
};
```

#### 第六步：部署到 Vercel（免费）

1. 注册 https://vercel.com 账号
2. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```
3. 在项目目录执行：
   ```bash
   vercel
   ```
4. 按照提示完成部署
5. 获得网址如：`https://classmate-book.vercel.app`

**或者使用 GitHub Pages：**

1. 创建 GitHub 仓库
2. 上传所有文件
3. Settings → Pages → 选择 main 分支
4. 获得网址如：`https://yourusername.github.io/classmate-book`

## 📱 分享给同学

部署完成后，把链接发到班级群：

```
✨ 那个夏天 - 我们的同学录 ✨

链接：https://你的网址

快来填写你的信息，留下你的祝福吧！
```

## 🎨 自定义配置

编辑 `js/config.js` 修改网站信息：

```javascript
SITE: {
    title: '那个夏天',           // 网站标题
    className: '高三X班',       // 班级名称
    year: '2024届',             // 届数
    description: '我们的青春纪念册'  // 描述
}
```

## ❓ 常见问题

### Q: 不配置 Supabase 能用吗？
A: 可以！使用模拟数据预览效果，但无法保存真实数据。

### Q: 照片上传失败？
A: 检查 Supabase Storage 是否创建了 `photos` 存储桶，并设置为公开。

### Q: 如何添加同学信息？
A: 目前需要在 Supabase 数据库的 `students` 表中手动添加。后续可以添加管理后台功能。

### Q: 数据安全吗？
A: Supabase 提供企业级安全，数据存储在云端，自动备份。

## 📄 技术栈

- 前端：HTML + CSS + JavaScript
- 后端：Supabase（免费云数据库）
- 存储：Supabase Storage
- 部署：Vercel / GitHub Pages

## 💝 致谢

感谢每一位高三X班的同学，这段青春因你们而精彩！

---

**那个夏天，我们的故事未完待续...** ✨
