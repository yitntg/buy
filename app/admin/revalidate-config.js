// 管理后台页面的全局配置
// 强制动态渲染，不使用静态生成
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true
export const preferredRegion = 'auto'

// 这个文件会被导入到所有admin页面中，确保它们都使用动态渲染 