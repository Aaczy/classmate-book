-- 那个夏天 - 电子同学录 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================
-- 1. 创建数据表
-- ============================================

-- 学生表
CREATE TABLE IF NOT EXISTS students (
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

-- 留言墙表
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 个人留言表
CREATE TABLE IF NOT EXISTS profile_messages (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 照片表
CREATE TABLE IF NOT EXISTS photos (
    id BIGSERIAL PRIMARY KEY,
    url TEXT,
    emoji TEXT DEFAULT '📷',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 时间胶囊表
CREATE TABLE IF NOT EXISTS capsules (
    id BIGSERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    open_date DATE NOT NULL,
    is_opened BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 启用实时功能（可选，用于多设备同步）
-- ============================================

ALTER TABLE students REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE profile_messages REPLICA IDENTITY FULL;
ALTER TABLE photos REPLICA IDENTITY FULL;
ALTER TABLE capsules REPLICA IDENTITY FULL;

-- 将表添加到实时发布
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE profile_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE capsules;

-- ============================================
-- 3. 设置访问权限（允许匿名访问）
-- ============================================

-- 允许匿名读取
CREATE POLICY "Allow anonymous read students" ON students
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read messages" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read profile_messages" ON profile_messages
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read photos" ON photos
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read capsules" ON capsules
    FOR SELECT USING (true);

-- 允许匿名插入
CREATE POLICY "Allow anonymous insert students" ON students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert messages" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert profile_messages" ON profile_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert photos" ON photos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert capsules" ON capsules
    FOR INSERT WITH CHECK (true);

-- 允许匿名更新（用于点赞、打开胶囊等）
CREATE POLICY "Allow anonymous update messages" ON messages
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous update capsules" ON capsules
    FOR UPDATE USING (true);

-- 启用 RLS（Row Level Security）
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. 插入示例数据（可选）
-- ============================================

-- 示例学生数据
INSERT INTO students (name, avatar, motto, zodiac, hobbies, university, wechat, tags) VALUES
('张小明', '😊', '人生如逆旅，我亦是行人', '天蝎座', '篮球、编程、看电影', '清华大学', 'zhangxm2024', '学习委员,篮球达人,数学天才'),
('李小红', '😄', '愿你出走半生，归来仍是少年', '双鱼座', '阅读、画画、旅行', '北京大学', 'lixiaohong2024', '文艺少女,绘画达人'),
('王小华', '🤗', '星光不负赶路人', '狮子座', '足球、音乐、游戏', '复旦大学', 'wangxh2024', '体育委员,足球健将'),
('赵小刚', '😎', '保持热爱，奔赴山海', '射手座', '摄影、吉他、健身', '浙江大学', 'zhaoxg2024', '搞笑担当,摄影大师'),
('陈小美', '🥰', '你的坚持终将美好', '天秤座', '舞蹈、瑜伽、美食', '上海交通大学', 'chenxm2024', '舞蹈达人,美食博主'),
('刘小强', '🤓', '学海无涯苦作舟', '金牛座', '编程、数学、动漫', '中国科学技术大学', 'liuxq2024', '学霸,编程高手');

-- 示例留言数据
INSERT INTO messages (author, content, likes) VALUES
('陈小美', '时间过得好快，转眼就要毕业了。感谢这三年遇到的每一个人，你们是我最珍贵的回忆。💕', 23),
('赵小刚', '高考加油！我们都会考上理想的大学！冲冲冲！🔥🔥🔥', 45),
('刘小强', '班主任说的对，高中三年是我们最单纯的时光。以后不管走到哪里，高三X班永远是我们的家。🏠', 67),
('张小明', '三年的同窗友谊，我会永远珍惜。祝大家前程似锦，未来可期！✨', 89);

-- 示例个人留言
INSERT INTO profile_messages (student_id, author, content) VALUES
(1, '李小红', '小明同学，三年同桌，谢谢你一直帮我讲数学题！祝你前程似锦！🎓'),
(1, '王小华', '球场上的最佳搭档，希望以后还能一起打球！🏀');

-- 示例时间胶囊
INSERT INTO capsules (author, content, open_date, is_opened) VALUES
('张小明', '三年后的我，不知道你现在在哪里上大学，有没有实现自己的梦想。不管怎样，希望你还是那个热爱生活的少年...', '2024-06-01', true),
('张小明', '这是给五年后自己的信，希望到那时，你已经实现了所有的梦想。记住，不管遇到什么困难，都要保持初心。', '2029-05-20', false),
('李小红', '亲爱的未来的我，希望你已经成为了想要成为的人。高中三年的朋友们，你们都好吗？', '2027-06-01', false);

-- ============================================
-- 5. 创建存储桶（需要在 Supabase 控制台手动创建）
-- ============================================

-- 请在 Storage 页面创建名为 "photos" 的 Public bucket

-- ============================================
-- 完成！现在可以在 config.js 中配置 Supabase 连接信息了
-- ============================================
