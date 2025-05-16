import CategoryDetailPage from '../../../src/customer/frontend/pages/Categories';

// 禁用静态生成，让此页面只在客户端请求时生成
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

// 为了满足Next.js的要求，添加空的getStaticProps
export async function getStaticProps() {
  return {
    props: {}
  };
}

export default CategoryDetailPage; 