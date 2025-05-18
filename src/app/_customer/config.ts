// 客户端部分的服务器配置

/**
 * 动态渲染配置
 * 'auto' - 根据请求决定是否为动态渲染
 * 'force-dynamic' - 始终使用动态渲染
 * 'force-static' - 始终使用静态渲染
 * 'error' - 如果需要动态渲染，则抛出错误
 */
export const dynamic = 'auto';

/**
 * 缓存配置
 * 'auto' - 根据使用情况自动决定缓存策略
 * 'default-cache' - 默认缓存
 * 'only-cache' - 仅允许使用缓存，不允许重新验证
 * 'force-cache' - 强制使用缓存
 * 'force-no-store' - 不使用缓存
 * 'default-no-store' - 默认不使用缓存
 * 'only-no-store' - 强制不使用缓存
 */
export const fetchCache = 'auto';

/**
 * 重新验证配置
 * 可以设置为一个数字（秒数）来指定重新验证的间隔
 */
export const revalidate = 300; // 5分钟缓存 