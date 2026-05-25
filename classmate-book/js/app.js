// 主应用逻辑
class App {
    constructor() {
        this.currentPage = 'home';
        this.currentStudent = null;
        this.init();
    }

    async init() {
        // 初始化页面
        await this.loadStats();
        await this.loadStudents();
        await this.loadMessages();
        await this.loadPhotos();
        await this.loadCapsules();

        // 设置网站信息
        this.updateSiteInfo();

        // 监听回车键
        this.setupEnterKeys();

        console.log('✨ 那个夏天 - 同学录已启动');
    }

    // 更新网站信息
    updateSiteInfo() {
        document.getElementById('classInfo').textContent = `${CONFIG.SITE.className} · ${CONFIG.SITE.year}`;
        document.getElementById('siteTitle').textContent = CONFIG.SITE.title;
        document.getElementById('siteSubtitle').textContent = CONFIG.SITE.description;
        document.title = `${CONFIG.SITE.title} - ${CONFIG.SITE.className}同学录`;
    }

    // 设置回车键监听
    setupEnterKeys() {
        document.getElementById('danmuInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendDanmu();
        });
    }

    // 显示/隐藏加载动画
    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // 页面切换
    showPage(pageId) {
        this.currentPage = pageId;

        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // 更新导航按钮状态
        document.querySelectorAll('.nav-links button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick')?.includes(pageId)) {
                btn.classList.add('active');
            }
        });

        // 关闭移动菜单
        document.getElementById('mobileMenu').classList.remove('active');

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 切换移动菜单
    toggleMobileMenu() {
        document.getElementById('mobileMenu').classList.toggle('active');
    }

    // 加载统计信息
    async loadStats() {
        const stats = await db.getStats();
        document.getElementById('studentCount').textContent = stats.students;
        document.getElementById('messageCount').textContent = stats.messages;
        document.getElementById('photoCount').textContent = stats.photos;
    }

    // 加载学生列表
    async loadStudents() {
        const { data: students } = await db.getStudents();
        const container = document.getElementById('studentsList');

        if (!students || students.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无同学信息</p>';
            return;
        }

        container.innerHTML = students.map(student => `
            <div class="card" onclick="app.showProfile(${student.id})">
                <div class="card-image">
                    ${student.avatar_url ? `<img src="${student.avatar_url}" alt="${student.name}">` : (student.avatar || '😊')}
                </div>
                <div class="card-body">
                    <h3 class="card-name">${student.name}</h3>
                    <p class="card-motto">${student.motto || ''}</p>
                </div>
            </div>
        `).join('');
    }

    // 显示个人主页
    async showProfile(studentId) {
        this.showLoading();

        const { data: student } = await db.getStudent(studentId);
        if (!student) {
            this.hideLoading();
            alert('找不到该同学的信息');
            return;
        }

        this.currentStudent = student;

        // 更新头像
        const avatarEl = document.getElementById('profileAvatar');
        if (student.avatar_url) {
            avatarEl.innerHTML = `<img src="${student.avatar_url}" alt="${student.name}">`;
        } else {
            avatarEl.innerHTML = student.avatar || '😊';
        }

        // 更新基本信息
        document.getElementById('profileName').textContent = student.name;
        document.getElementById('profileMotto').textContent = `「${student.motto || ''}」`;

        // 更新标签
        const tagsContainer = document.getElementById('profileTags');
        const tags = student.tags ? student.tags.split(',') : [];
        tagsContainer.innerHTML = tags.map(tag => `<span class="tag">${tag.trim()}</span>`).join('');

        // 更新个人信息
        const infoContainer = document.getElementById('profileInfo');
        infoContainer.innerHTML = `
            <div class="info-item">
                <div class="info-label">星座</div>
                <div class="info-value">${student.zodiac || '未填写'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">爱好</div>
                <div class="info-value">${student.hobbies || '未填写'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">目标大学</div>
                <div class="info-value">${student.university || '未填写'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">微信</div>
                <div class="info-value">${student.wechat || '未填写'}</div>
            </div>
        `;

        // 加载个人留言
        await this.loadProfileMessages(studentId);

        this.hideLoading();
        this.showPage('profile');
    }

    // 加载个人留言
    async loadProfileMessages(studentId) {
        const { data: messages } = await db.getProfileMessages(studentId);
        const container = document.getElementById('profileMessages');

        if (!messages || messages.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">暂无留言，快来留下第一条吧！</p>';
            return;
        }

        container.innerHTML = messages.map(msg => `
            <div class="message-card">
                <div class="message-header">
                    <span class="message-author">${msg.author}</span>
                    <span class="message-time">${this.formatDate(msg.created_at)}</span>
                </div>
                <p class="message-content">${msg.content}</p>
            </div>
        `).join('');
    }

    // 发送个人留言
    async sendProfileMessage() {
        if (!this.currentStudent) return;

        const input = document.getElementById('profileMessageInput');
        const content = input.value.trim();

        if (!content) {
            alert('请输入留言内容');
            return;
        }

        // 简单的防滥用：随机用户名
        const author = prompt('请输入你的名字：', '匿名同学');
        if (!author) return;

        this.showLoading();

        const { data, error } = await db.addProfileMessage({
            student_id: this.currentStudent.id,
            author: author,
            content: content
        });

        this.hideLoading();

        if (error) {
            alert('发送失败，请重试');
            return;
        }

        input.value = '';
        await this.loadProfileMessages(this.currentStudent.id);
    }

    // 加载留言墙
    async loadMessages() {
        const { data: messages } = await db.getMessages();
        const container = document.getElementById('messagesList');

        if (!messages || messages.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无留言</p>';
            return;
        }

        container.innerHTML = messages.map(msg => `
            <div class="message-card">
                <div class="message-header">
                    <span class="message-author">${msg.author}</span>
                    <span class="message-time">${this.formatDateTime(msg.created_at)}</span>
                </div>
                <p class="message-content">${msg.content}</p>
                <div class="message-actions">
                    <button class="action-btn" onclick="app.likeMessage(${msg.id}, this)">❤️ ${msg.likes || 0}</button>
                    <button class="action-btn">💬 回复</button>
                </div>
            </div>
        `).join('');
    }

    // 发送留言
    async sendMessage() {
        const contentInput = document.getElementById('messageInput');
        const authorInput = document.getElementById('messageAuthor');
        const content = contentInput.value.trim();
        const author = authorInput.value.trim() || '匿名同学';

        if (!content) {
            alert('请输入留言内容');
            return;
        }

        this.showLoading();

        const { data, error } = await db.addMessage({
            author: author,
            content: content
        });

        this.hideLoading();

        if (error) {
            alert('发送失败，请重试');
            return;
        }

        contentInput.value = '';
        await this.loadMessages();
        await this.loadStats();
    }

    // 点赞留言
    async likeMessage(messageId, btn) {
        const { data, error } = await db.likeMessage(messageId);
        if (!error && data) {
            btn.innerHTML = `❤️ ${data.likes}`;
        }
    }

    // 加载照片
    async loadPhotos() {
        const { data: photos } = await db.getPhotos();
        const container = document.getElementById('photosList');

        if (!photos || photos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无照片，快来上传第一张吧！</p>';
            return;
        }

        container.innerHTML = photos.map(photo => `
            <div class="photo-item">
                ${photo.url ? `<img src="${photo.url}" alt="照片">` : (photo.emoji || '📷')}
            </div>
        `).join('');
    }

    // 上传照片
    async uploadPhoto() {
        const input = document.getElementById('photoInput');
        const file = input.files[0];

        if (!file) return;

        // 检查文件大小（限制 10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('照片大小不能超过 10MB');
            return;
        }

        this.showLoading();

        const { data, error } = await db.uploadPhoto(file);

        this.hideLoading();

        if (error) {
            alert('上传失败，请重试');
            return;
        }

        input.value = '';
        await this.loadPhotos();
        await this.loadStats();
    }

    // 发送弹幕
    sendDanmu() {
        const input = document.getElementById('danmuInput');
        const text = input.value.trim();

        if (!text) return;

        const container = document.getElementById('danmuContainer');
        const danmu = document.createElement('div');
        danmu.className = 'danmu-item';
        danmu.style.top = Math.random() * 350 + 40 + 'px';
        danmu.textContent = text;
        container.appendChild(danmu);

        input.value = '';

        // 动画结束后移除
        setTimeout(() => {
            danmu.remove();
        }, 10000);
    }

    // 加载时间胶囊
    async loadCapsules() {
        const { data: capsules } = await db.getCapsules();
        const container = document.getElementById('capsuleList');

        if (!capsules || capsules.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无时间胶囊</p>';
            return;
        }

        container.innerHTML = capsules.map(capsule => {
            const isOpenable = new Date(capsule.open_date) <= new Date();
            const isOpened = capsule.is_opened;

            return `
                <div class="capsule-card ${!isOpenable && !isOpened ? 'locked' : ''}">
                    <div class="capsule-meta">
                        <span class="capsule-author">${capsule.author}</span>
                        <span class="capsule-date">${this.formatDate(capsule.created_at)} 封存</span>
                    </div>
                    <p class="capsule-content" style="${!isOpened && !isOpenable ? 'filter: blur(6px); user-select: none;' : ''}">${capsule.content}</p>
                    ${isOpened ?
                        `<p class="capsule-status open">🔓 已打开</p>` :
                        (isOpenable ?
                            `<p class="capsule-status open" onclick="app.openCapsule(${capsule.id})">🔓 点击打开</p>` :
                            `<p class="capsule-status locked-text">🔒 ${capsule.open_date} 才能打开</p>`
                        )
                    }
                </div>
            `;
        }).join('');
    }

    // 创建时间胶囊
    async createCapsule() {
        const contentInput = document.getElementById('capsuleContent');
        const authorInput = document.getElementById('capsuleAuthor');
        const dateInput = document.getElementById('capsuleDate');

        const content = contentInput.value.trim();
        const author = authorInput.value.trim() || '匿名同学';
        const openDate = dateInput.value;

        if (!content) {
            alert('请输入内容');
            return;
        }

        if (!openDate) {
            alert('请选择打开日期');
            return;
        }

        this.showLoading();

        const { data, error } = await db.createCapsule({
            author: author,
            content: content,
            open_date: openDate
        });

        this.hideLoading();

        if (error) {
            alert('创建失败，请重试');
            return;
        }

        contentInput.value = '';
        await this.loadCapsules();
        alert('💊 时间胶囊已封存！');
    }

    // 打开时间胶囊
    async openCapsule(capsuleId) {
        if (!confirm('确定要打开这个时间胶囊吗？打开后将无法重新封存。')) {
            return;
        }

        const { data, error } = await db.openCapsule(capsuleId);
        if (!error) {
            await this.loadCapsules();
        }
    }

    // 格式化日期
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 格式化日期时间
    formatDateTime(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    }
}

// 启动应用
const app = new App();
