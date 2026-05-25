// Supabase 数据库操作封装
class SupabaseDB {
    constructor() {
        this.supabase = null;
        this.init();
    }

    init() {
        // 检查配置是否已设置
        if (CONFIG.SUPABASE_URL === 'YOUR_SUPABASE_URL') {
            console.warn('请先配置 Supabase！查看 README.md 了解如何设置。');
            this.useMockData = true;
            this.mockData = this.getMockData();
            return;
        }

        this.supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        this.useMockData = false;
    }

    // 模拟数据（用于预览和测试）
    getMockData() {
        return {
            students: [
                {
                    id: 1,
                    name: '张小明',
                    avatar: '😊',
                    motto: '人生如逆旅，我亦是行人',
                    zodiac: '天蝎座',
                    hobbies: '篮球、编程、看电影',
                    university: '清华大学',
                    wechat: 'zhangxm2024',
                    tags: '学习委员,篮球达人,数学天才',
                    created_at: '2024-05-01'
                },
                {
                    id: 2,
                    name: '李小红',
                    avatar: '😄',
                    motto: '愿你出走半生，归来仍是少年',
                    zodiac: '双鱼座',
                    hobbies: '阅读、画画、旅行',
                    university: '北京大学',
                    wechat: 'lixiaohong2024',
                    tags: '文艺少女,绘画达人',
                    created_at: '2024-05-02'
                },
                {
                    id: 3,
                    name: '王小华',
                    avatar: '🤗',
                    motto: '星光不负赶路人',
                    zodiac: '狮子座',
                    hobbies: '足球、音乐、游戏',
                    university: '复旦大学',
                    wechat: 'wangxh2024',
                    tags: '体育委员,足球健将',
                    created_at: '2024-05-03'
                },
                {
                    id: 4,
                    name: '赵小刚',
                    avatar: '😎',
                    motto: '保持热爱，奔赴山海',
                    zodiac: '射手座',
                    hobbies: '摄影、吉他、健身',
                    university: '浙江大学',
                    wechat: 'zhaoxg2024',
                    tags: '搞笑担当,摄影大师',
                    created_at: '2024-05-04'
                },
                {
                    id: 5,
                    name: '陈小美',
                    avatar: '🥰',
                    motto: '你的坚持终将美好',
                    zodiac: '天秤座',
                    hobbies: '舞蹈、瑜伽、美食',
                    university: '上海交通大学',
                    wechat: 'chenxm2024',
                    tags: '舞蹈达人,美食博主',
                    created_at: '2024-05-05'
                },
                {
                    id: 6,
                    name: '刘小强',
                    avatar: '🤓',
                    motto: '学海无涯苦作舟',
                    zodiac: '金牛座',
                    hobbies: '编程、数学、动漫',
                    university: '中国科学技术大学',
                    wechat: 'liuxq2024',
                    tags: '学霸,编程高手',
                    created_at: '2024-05-06'
                }
            ],
            messages: [
                {
                    id: 1,
                    author: '陈小美',
                    content: '时间过得好快，转眼就要毕业了。感谢这三年遇到的每一个人，你们是我最珍贵的回忆。💕',
                    likes: 23,
                    created_at: '2024-05-25T14:30:00'
                },
                {
                    id: 2,
                    author: '赵小刚',
                    content: '高考加油！我们都会考上理想的大学！冲冲冲！🔥🔥🔥',
                    likes: 45,
                    created_at: '2024-05-25T10:15:00'
                },
                {
                    id: 3,
                    author: '刘小强',
                    content: '班主任说的对，高中三年是我们最单纯的时光。以后不管走到哪里，高三X班永远是我们的家。🏠',
                    likes: 67,
                    created_at: '2024-05-24T20:00:00'
                },
                {
                    id: 4,
                    author: '张小明',
                    content: '三年的同窗友谊，我会永远珍惜。祝大家前程似锦，未来可期！✨',
                    likes: 89,
                    created_at: '2024-05-24T18:30:00'
                }
            ],
            profile_messages: [
                {
                    id: 1,
                    student_id: 1,
                    author: '李小红',
                    content: '小明同学，三年同桌，谢谢你一直帮我讲数学题！祝你前程似锦！🎓',
                    created_at: '2024-05-20'
                },
                {
                    id: 2,
                    student_id: 1,
                    author: '王小华',
                    content: '球场上的最佳搭档，希望以后还能一起打球！🏀',
                    created_at: '2024-05-19'
                }
            ],
            photos: [
                { id: 1, url: '', emoji: '🏫', created_at: '2024-05-01' },
                { id: 2, url: '', emoji: '🎓', created_at: '2024-05-02' },
                { id: 3, url: '', emoji: '⚽', created_at: '2024-05-03' },
                { id: 4, url: '', emoji: '📚', created_at: '2024-05-04' },
                { id: 5, url: '', emoji: '🎭', created_at: '2024-05-05' },
                { id: 6, url: '', emoji: '🎪', created_at: '2024-05-06' }
            ],
            capsules: [
                {
                    id: 1,
                    author: '张小明',
                    content: '三年后的我，不知道你现在在哪里上大学，有没有实现自己的梦想。不管怎样，希望你还是那个热爱生活的少年...',
                    open_date: '2024-06-01',
                    is_opened: true,
                    created_at: '2024-05-25'
                },
                {
                    id: 2,
                    author: '张小明',
                    content: '这是给五年后自己的信，内容被锁住了...',
                    open_date: '2029-05-20',
                    is_opened: false,
                    created_at: '2024-05-20'
                }
            ]
        };
    }

    // 获取学生列表
    async getStudents() {
        if (this.useMockData) {
            return { data: this.mockData.students, error: null };
        }

        const { data, error } = await this.supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: true });

        return { data, error };
    }

    // 获取单个学生信息
    async getStudent(id) {
        if (this.useMockData) {
            const student = this.mockData.students.find(s => s.id === id);
            return { data: student, error: null };
        }

        const { data, error } = await this.supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        return { data, error };
    }

    // 添加学生
    async addStudent(studentData) {
        if (this.useMockData) {
            const newStudent = {
                id: this.mockData.students.length + 1,
                ...studentData,
                created_at: new Date().toISOString()
            };
            this.mockData.students.push(newStudent);
            return { data: newStudent, error: null };
        }

        const { data, error } = await this.supabase
            .from('students')
            .insert([studentData])
            .select();

        return { data: data?.[0], error };
    }

    // 获取留言列表
    async getMessages() {
        if (this.useMockData) {
            return { data: this.mockData.messages, error: null };
        }

        const { data, error } = await this.supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    }

    // 发送留言
    async addMessage(messageData) {
        if (this.useMockData) {
            const newMessage = {
                id: this.mockData.messages.length + 1,
                ...messageData,
                likes: 0,
                created_at: new Date().toISOString()
            };
            this.mockData.messages.unshift(newMessage);
            return { data: newMessage, error: null };
        }

        const { data, error } = await this.supabase
            .from('messages')
            .insert([messageData])
            .select();

        return { data: data?.[0], error };
    }

    // 点赞留言
    async likeMessage(messageId) {
        if (this.useMockData) {
            const message = this.mockData.messages.find(m => m.id === messageId);
            if (message) message.likes += 1;
            return { data: message, error: null };
        }

        // 先获取当前点赞数
        const { data: current } = await this.supabase
            .from('messages')
            .select('likes')
            .eq('id', messageId)
            .single();

        const { data, error } = await this.supabase
            .from('messages')
            .update({ likes: (current?.likes || 0) + 1 })
            .eq('id', messageId)
            .select();

        return { data: data?.[0], error };
    }

    // 获取个人留言
    async getProfileMessages(studentId) {
        if (this.useMockData) {
            const messages = this.mockData.profile_messages.filter(m => m.student_id === studentId);
            return { data: messages, error: null };
        }

        const { data, error } = await this.supabase
            .from('profile_messages')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });

        return { data, error };
    }

    // 发送个人留言
    async addProfileMessage(messageData) {
        if (this.useMockData) {
            const newMessage = {
                id: this.mockData.profile_messages.length + 1,
                ...messageData,
                created_at: new Date().toISOString()
            };
            this.mockData.profile_messages.push(newMessage);
            return { data: newMessage, error: null };
        }

        const { data, error } = await this.supabase
            .from('profile_messages')
            .insert([messageData])
            .select();

        return { data: data?.[0], error };
    }

    // 获取照片列表
    async getPhotos() {
        if (this.useMockData) {
            return { data: this.mockData.photos, error: null };
        }

        const { data, error } = await this.supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    }

    // 上传照片
    async uploadPhoto(file) {
        if (this.useMockData) {
            const newPhoto = {
                id: this.mockData.photos.length + 1,
                url: URL.createObjectURL(file),
                emoji: '📷',
                created_at: new Date().toISOString()
            };
            this.mockData.photos.unshift(newPhoto);
            return { data: newPhoto, error: null };
        }

        // 上传文件到 Storage
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await this.supabase.storage
            .from(CONFIG.STORAGE_BUCKET)
            .upload(fileName, file);

        if (uploadError) {
            return { data: null, error: uploadError };
        }

        // 获取公开链接
        const { data: { publicUrl } } = this.supabase.storage
            .from(CONFIG.STORAGE_BUCKET)
            .getPublicUrl(fileName);

        // 保存到数据库
        const { data, error } = await this.supabase
            .from('photos')
            .insert([{ url: publicUrl, emoji: '' }])
            .select();

        return { data: data?.[0], error };
    }

    // 获取时间胶囊
    async getCapsules() {
        if (this.useMockData) {
            return { data: this.mockData.capsules, error: null };
        }

        const { data, error } = await this.supabase
            .from('capsules')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    }

    // 创建时间胶囊
    async createCapsule(capsuleData) {
        if (this.useMockData) {
            const newCapsule = {
                id: this.mockData.capsules.length + 1,
                ...capsuleData,
                is_opened: false,
                created_at: new Date().toISOString()
            };
            this.mockData.capsules.unshift(newCapsule);
            return { data: newCapsule, error: null };
        }

        const { data, error } = await this.supabase
            .from('capsules')
            .insert([capsuleData])
            .select();

        return { data: data?.[0], error };
    }

    // 打开时间胶囊
    async openCapsule(capsuleId) {
        if (this.useMockData) {
            const capsule = this.mockData.capsules.find(c => c.id === capsuleId);
            if (capsule) capsule.is_opened = true;
            return { data: capsule, error: null };
        }

        const { data, error } = await this.supabase
            .from('capsules')
            .update({ is_opened: true })
            .eq('id', capsuleId)
            .select();

        return { data: data?.[0], error };
    }

    // 获取统计信息
    async getStats() {
        if (this.useMockData) {
            return {
                students: this.mockData.students.length,
                messages: this.mockData.messages.length,
                photos: this.mockData.photos.length
            };
        }

        const [studentsResult, messagesResult, photosResult] = await Promise.all([
            this.supabase.from('students').select('id', { count: 'exact', head: true }),
            this.supabase.from('messages').select('id', { count: 'exact', head: true }),
            this.supabase.from('photos').select('id', { count: 'exact', head: true })
        ]);

        return {
            students: studentsResult.count || 0,
            messages: messagesResult.count || 0,
            photos: photosResult.count || 0
        };
    }
}

// 创建全局数据库实例
const db = new SupabaseDB();
