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
    ],
  });
}

export default authJwt;
