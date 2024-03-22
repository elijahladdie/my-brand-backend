import supertest from 'supertest';
import { Express } from 'express';
import { app, server } from '../index'; // Assuming 'app' is your Express application instance
import { RegisterAdmin, GetAdmin, Login } from '../controllers/adminController';
import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
import { AdminRoutes } from '../routes';


const adminPayload = {
  email: "KaBingo@gmail.com",
  fullName: "kamembe",
  password: "yg",
  recoveryPassword: process.env.TEST_PASSWORD
}
const loginPayload = {
    "email": process.env.TEST_EMAIL as string,
    "password": process.env.TEST_PASSWORD as string
  }


describe('Admin Routes', () => {
  let authToken: string;
  const authorizeRequests = async () => {
    const loginResponse = await supertest(app)
      .post("/admin/access/login")
      .send(loginPayload);
    authToken = loginResponse.body.token;
  };


  beforeAll(async () => {
    app.use("/admin", AdminRoutes);

    try {
      const options: ConnectOptions = {
        dbName: 'my_brand_test',
      };
      await mongoose.connect(process.env.MONGO_DB_TEST as string, options);
      await authorizeRequests();
    } catch (error) {
      console.log("Error connecting to MongoDB:", error);
    }
  });

  describe('POST /admin/access/login', () => {
    it('should login admin and return authentication token', async () => {
      const response = await supertest(app)
        .post('/admin/access/login')
        .send(adminPayload); // Mock login payload
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /admin/create', () => {
    it('should create a new admin', async () => {
      const response = await supertest(app)
        .post('/admin/create')
        .send(adminPayload); // Mock registration payload
      expect(response.status).toBe(200);
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
