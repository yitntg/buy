import { NextResponse } from 'next/server';
import pg from 'pg';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 获取查询参数
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = parseInt(searchParams.get('offset') || '0');
  const sort = searchParams.get('sort') || 'id'; // id, price, rating
  const order = searchParams.get('order') || 'asc'; // asc, desc
  const search = searchParams.get('search') || '';
  
  try {
    // 连接数据库
    const client = new pg.Client({
      connectionString: process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    // 构建查询
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category = c.id';
    const params: any[] = [];
    let whereClause = '';
    
    // 添加筛选条件
    if (category) {
      whereClause += params.length ? ' AND' : ' WHERE';
      whereClause += ` p.category = $${params.length + 1}`;
      params.push(category);
    }
    
    // 添加搜索条件
    if (search) {
      whereClause += params.length ? ' AND' : ' WHERE';
      whereClause += ` (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    
    // 添加排序
    let validSortColumns = ['id', 'name', 'price', 'rating', 'created_at'];
    let validOrders = ['asc', 'desc'];
    
    const sortColumn = validSortColumns.includes(sort) ? sort : 'id';
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order : 'asc';
    
    // 组合完整查询
    query += whereClause;
    query += ` ORDER BY p.${sortColumn} ${sortOrder}`;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    // 同时获取总数以用于分页
    let countQuery = 'SELECT COUNT(*) as total FROM products p';
    countQuery += whereClause;
    
    // 执行查询
    console.log('执行查询:', query, params);
    const result = await client.query(query, params);
    const countResult = await client.query(countQuery, params.slice(0, params.length - 2));
    
    await client.end();
    
    // 返回结果
    return NextResponse.json({
      products: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    return NextResponse.json(
      { error: '获取产品列表失败', details: error instanceof Error ? error.message : '未知错误' }, 
      { status: 500 }
    );
  }
} 