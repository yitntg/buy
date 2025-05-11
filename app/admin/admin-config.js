// admin页面的统一配置文件 - 所有配置都从这里导出

// 使用确定的字符串字面量值，避免导出变量引用
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0  // 数字0是合法的revalidate值
export const dynamicParams = true
// 确保preferredRegion是字符串字面量
export const preferredRegion = 'auto'
// 确保runtime是字符串字面量
export const runtime = 'nodejs' 