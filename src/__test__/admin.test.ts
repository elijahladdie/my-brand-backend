import supertest from 'supertest';
import { app, server } from '../index'; // Assuming 'app' is your Express application instance
import mongoose from 'mongoose';

const randomNum = Math.floor(Math.random() * 2002) +2
const adminPayload = {
  email: process.env.TEST_EMAIL as string + randomNum,
  fullName: "Mukiza" + randomNum,
  password: process.env.TEST_PASSWORD,
  recoveryPassword: process.env.TEST_PASSWORD
}



describe('Admin Routes', () => {
  let authToken: string;


  describe('POST /admin/create', () => {
    it('should create a new admin', async () => {
      const response = await supertest(app)
        .post('/admin/create')
        .send(adminPayload); // Mock registration payload
      expect(response.status).toBe(201);
    });
  });

  describe('POST /admin/access/login', () => {
    it('should login admin and return authentication token', async () => {
      const response = await supertest(app)
        .post('/admin/access/login')
        .send(adminPayload); // Mock login payload
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;

    });
  });


  describe('GET /admin/', () => {
    it('should get admin details', async () => {
      const response = await supertest(app)
        .get('/admin')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
    server.close()
  });
});
