import { expressjwt as jwt } from 'express-jwt';

function authJwt() {
  const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;

  return jwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      { url: /\/api\/user\/signup/, methods: ['POST'] }, // Bỏ qua xác thực cho /signup
      { url: /\/api\/user\/signin/, methods: ['POST'] }, // Bỏ qua xác thực cho /signin
      { url: /\/api\/products/, methods: ['GET'] }, // Bỏ qua xác thực cho /api/products (chỉ xem sản phẩm)
      { url: /\/api\/category/, methods: ['GET'] }, // Bỏ qua xác thực cho /api/category (chỉ xem danh mục)
      { url: /\/api\/subcategory/, methods: ['GET'] }, // Bỏ qua xác thực cho /api/subcategory
    ],
  });
}

export default authJwt;
