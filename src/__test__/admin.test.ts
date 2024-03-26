import supertest from 'supertest';
import { app, server } from '../index'; // Assuming 'app' is your Express application instance
import mongoose from 'mongoose';

const randomNum = Math.floor(Math.random() * 2002) + 2
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

    it('should return an error when an admin with the same email already exists', async () => {
      const duplicateAdminPayload = {
        email: 'admin@example.com',
        password: 'adminPassword', 
        fullName: "Mukiza" + randomNum,
        recoveryPassword: process.env.TEST_PASSWORD

      };

      const response = await supertest(app)
        .post('/admin/create')
        .send(duplicateAdminPayload);

      expect(response.status).toBe(200); // Conflict status code
      expect(response.body).toHaveProperty('Message', 'Admin already exists');
    });

    it('should return an error when email is missing in registration payload', async () => {
      const invalidAdminPayload = {
        password: 'password'
      };

      const response = await supertest(app)
        .post('/admin/create')
        .send(invalidAdminPayload);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined;
    });

    it('should return an error when password is missing in registration payload', async () => {
      const invalidAdminPayload = {
        email: 'admin@example.com',
      };

      const response = await supertest(app)
        .post('/admin/create')
        .send(invalidAdminPayload);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined;
    });

  });


  describe('POST /admin/access/login', () => {
    it('should login admin and return authentication token', async () => {
      const response = await supertest(app)
        .post('/admin/access/login')
        .send(adminPayload); // Mock login payload

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      authToken = response.body.token;
    });

    it('should return an error when login credentials are incorrect', async () => {
      const invalidAdminPayload = {
        email: 'invalid@example.com',
        password: 'invalidPassword'
      };

      const response = await supertest(app)
        .post('/admin/access/login')
        .send(invalidAdminPayload);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Admin not found');
    });

    it('should return an error when email is missing in login payload', async () => {
      const invalidAdminPayload = {
        password: 'password'
      };

      const response = await supertest(app)
        .post('/admin/access/login')
        .send(invalidAdminPayload);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Admin not found');
    });

    it('should return an error when password is missing in login payload', async () => {
      const invalidAdminPayload = {
        email: 'admin@test.com',
      };

      const response = await supertest(app)
        .post('/admin/access/login')
        .send(invalidAdminPayload);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', "Internal server error");
    });

  });



  describe('GET /admin/', () => {
    it('should get admin details', async () => {
      const response = await supertest(app)
        .get('/admin')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy;
    });

    it('should return an error when no authorization token is provided', async () => {
      const response = await supertest(app)
        .get('/admin');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    it('should return an error when an invalid authorization token is provided', async () => {
      const response = await supertest(app)
        .get('/admin')
        .set('Authorization', 'Bearer invalidToken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'You are not authorized');
    });

  });

  afterAll(async () => {
    await mongoose.disconnect();
    server.close()
  });
});
