// 配置文件 - 部署时需要修改这里的 Supabase 配置
const CONFIG = {
    // Supabase 配置 - 登录 https://supabase.com 获取
    SUPABASE_URL: 'https://ayuqpqljtbejyihtlinu.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_sKLuEkctFBWP_R9_iw-W1g_ggOlLS7t',

    // 网站配置
    SITE: {
        title: '那个夏天',
        className: '高三14班',
        year: '2026届',
        description: '我们的青春纪念册'
    },

    // 照片存储桶名称（在 Supabase Storage 中创建）
    STORAGE_BUCKET: 'photos'
};
