const request = require('supertest');
const app = require('./app');

describe('Incoming POST Endpoint checks', () => {
  test('Calculate energy savings from input', async () => {
    const res = await request(app).post('/api/calculate').send({
      amount: 5000,
    });

    expect(res.status).toEqual(200);
    expect(res.body.data).toHaveProperty('amount');
  });
});
