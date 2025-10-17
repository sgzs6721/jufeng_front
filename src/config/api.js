// API配置文件 - 统一管理所有API相关配置
import axios from 'axios';

// 环境配置
const ENVIRONMENTS = {
  // 开发环境
  development: {
    REMOTE_HOST: 'http://121.36.91.199:7088',
    API_BASE_PATH: '/jufeng/api',
    USE_PROXY: true, // 开发环境使用 Vite 代理
    PROTO: 'http',
    PORT: '7088',
  },
  
  // 测试环境
  testing: {
    REMOTE_HOST: 'http://jufeng.devtesting.top',
    API_BASE_PATH: '/jufeng/api',
    USE_PROXY: false,
    PROTO: 'http',
    PORT: '80',
  },
  
  // 生产环境
  production: {
    REMOTE_HOST: 'http://jufeng.devtesting.top',
    API_BASE_PATH: '/jufeng/api',
    USE_PROXY: false,
    PROTO: 'http',
    PORT: '80',
  }
};

// 当前环境 - 自动判断
let CURRENT_ENV = 'development'; // 默认为开发环境

// 在浏览器环境中判断
if (typeof window !== 'undefined') {
  // 如果不是 localhost，则使用生产环境
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    CURRENT_ENV = 'production';
  }
}
// 在 Node.js/Vite 构建环境中，检查 NODE_ENV
else if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  CURRENT_ENV = 'production';
}

// 获取当前环境配置
const getCurrentConfig = () => ENVIRONMENTS[CURRENT_ENV];

// API配置
export const API_CONFIG = {
  // 当前环境配置
  ...getCurrentConfig(),
  
  // 请求超时时间
  TIMEOUT: 60000,
  
  // 请求头配置
  get HEADERS() {
    const c = getCurrentConfig();
    return {
      'Content-Type': 'application/json',
      'X-Forwarded-Proto': c.PROTO,
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest'
    };
  },
  
  // 代理配置
  get PROXY() {
    const c = getCurrentConfig();
    return {
      TIMEOUT: 30000,
      FOLLOW_REDIRECTS: false,
      HEADERS: {
        'X-Forwarded-Proto': c.PROTO,
        'X-Forwarded-Port': c.PORT,
        'X-Real-IP': '127.0.0.1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };
  }
};

// 获取API基础URL
export const getApiBaseUrl = () => {
  const config = getCurrentConfig();
  
  // 如果使用代理，返回代理路径
  if (config.USE_PROXY) {
    return config.API_BASE_PATH;
  }
  
  // 否则返回完整URL
  return config.REMOTE_HOST + config.API_BASE_PATH;
};

// 导出常用配置
export const REMOTE_HOST = getCurrentConfig().REMOTE_HOST;
export const API_BASE_PATH = getCurrentConfig().API_BASE_PATH;
export const TIMEOUT = API_CONFIG.TIMEOUT;
export const HEADERS = API_CONFIG.HEADERS;
export const PROXY = API_CONFIG.PROXY;

// 导出环境切换函数（用于调试）
export const switchEnvironment = (env) => {
  if (ENVIRONMENTS[env]) {
    return ENVIRONMENTS[env];
  }
  console.warn(`环境 ${env} 不存在`);
  return getCurrentConfig();
};

// 创建 axios 实例
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || '网络错误，请稍后重试';
    return Promise.reject(new Error(message));
  }
);

// 默认导出 axios 实例（保持向后兼容）
export default api;

// 调试信息
console.log('当前API配置:', {
  环境: CURRENT_ENV,
  远程主机: REMOTE_HOST,
  API路径: API_BASE_PATH,
  使用代理: getCurrentConfig().USE_PROXY,
  基础URL: getApiBaseUrl()
});
