import supertest from "supertest";
import mongoose,{ConnectOptions} from "mongoose";
import { app, server } from "../index";

const blogPayload = {
  blogTitle: "Test Blog",
  blogBody: "Lorem ipsum dolor sit amet",
  blogImage: {
    fieldname: "blogImage",
    originalname: "test-image.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "/tmp",
    filename: "test-image.jpg",
    path: "/tmp/test-image.jpg",
    size: 1000, 
  },
  };

  export const userPayload = {
    "email": process.env.TEST_EMAIL as string,
    "password": process.env.TEST_PASSWORD as string
  }

import { blogRoutes } from "../routes/blogRoutes";

  const blogId = process.env.TEST_BLOGID as string;
  let authToken: string;

  const authorizeRequests = async () => {
    const loginResponse = await supertest(app)
      .post("/admin/access/login")
      .send(userPayload);
    authToken = loginResponse.body.token;
  };


  describe("Blog Routes", () => {

  beforeAll(async () => {
    app.use("/blog", blogRoutes);

    try {
      const options: ConnectOptions = {
        dbName: 'my_brand_test',
      };
      await mongoose.connect(process.env.MONGO_DB_TEST as string,options);
      await authorizeRequests();
    } catch (error) {
      console.log("Error connecting to MongoDB:", error);
    }
  });



  describe("GET /blog/all", () => {
    it("should return all blogs", async () => {

      const response = await supertest(app).get("/blog/all").set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined;
    }, 10000);
  });

  describe("GET /blog/byid/:blog_id", () => {
    it("should return a single blog by ID", async () => {
      const response = await supertest(app).get(`/blog/byid/${blogId}`).set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Blog fetched successfully");
    });
  });

  describe("POST /blog/create", () => {
    it("should create return error in creating new blog", async () => {
      const response = await supertest(app).post("/blog/create").send(blogPayload).set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "No file uploaded");
    });
  });


  describe("PUT /blog/like/:blog_id", () => {
    it("should like a blog", async () => {
      const response = await supertest(app).put(`/blog/like/${blogId}`).set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Blog Liked successfully");
    });
  });

  describe("PUT /blog/update/:blog_id", () => {
    it("should update a blog", async () => {

      const response = await supertest(app).put(`/blog/update/${blogId}`).send(blogPayload).set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Blog updated successfully");
    });
  });

  describe("POST /blog/:blog_id/comment", () => {
    it("should add a comment to a blog", async () => {
      const commentData = {
        comment: "Test comment",
        name: "Kabera"
      };
      const response = await supertest(app).post(`/blog/${blogId}/comment`).send(commentData).set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Comment created successfully");
    });
  });

  describe("DELETE /blog/delete/:blog_id", () => {
    it("should delete a blog", async () => {
      const response = await supertest(app).delete(`/blog/delete/${blogId}`).set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Blog successful removed!");
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    server.close()
  });
});
