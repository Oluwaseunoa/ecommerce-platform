const request = require('supertest');
const app = require('./index');

describe('GET /products', () => {
  it('returns a list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('POST /login', () => {
  it('returns a token with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('returns 400 if credentials are missing', async () => {
    const res = await request(app).post('/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /orders', () => {
  it('places an order successfully', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ userId: 'user1', items: [{ id: 1, qty: 2 }] });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
    expect(res.body.status).toBe('placed');
  });

  it('returns 400 if items are missing', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ userId: 'user1', items: [] });
    expect(res.statusCode).toBe(400);
  });
});