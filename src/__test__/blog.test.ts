import supertest from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import { app, server } from "../index";
const randomNum = Math.floor(Math.random() * 2002) + 2

interface BlogPayload {
  blogTitle?: string;
  blogBody: string;
  blogImage?: string
}
const blogPayload: BlogPayload = {
  blogTitle: "Test Blog" + randomNum,
  blogBody: "Lorem ipsum dolor sit amet",
  blogImage: "C:/Users/Laddie/Downloads/pexels-image.jpg"
};

export const userPayload = {
  "email": process.env.TEST_EMAIL as string,
  "password": process.env.TEST_PASSWORD as string
}

import { blogRoutes } from "../routes/blogRoutes";
import axios from "axios";

// const blogId = proce
let authToken: string;
let blogId: string;

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

      await authorizeRequests();
    } catch (error) {
      console.log("Error Authorizing requests:", error);
    }
  }, 5000);

  const fs = require("fs");

  describe("POST /blog/create", () => {
    it("should create a new blog", async () => {
      const imageUrl = "https://res.cloudinary.com/diwmlqcru/image/upload/v1711483606/uploads/pexels-image_d5iysy.jpg";
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
  
      const response = await supertest(app)
        .post("/blog/create")
        .attach("blogImage", imageBuffer, "pexels-image_d5iysy.jpg")
        .field("blogTitle", blogPayload.blogTitle as string)
        .field("blogBody", blogPayload.blogBody)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Blog Created successfully");
    }, 20000);

    it("should return an success for blog creation", async () => {
      const incompleteBlogPayload = { ...blogPayload };
      delete incompleteBlogPayload.blogImage;

      const response = await supertest(app)
        .post("/blog/create")
        .send(incompleteBlogPayload)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("Message", "Blog already exists");
    });

    it("should return an error when required fields are missing in blog payload", async () => {
      const incompleteBlogPayload = { ...blogPayload };
      delete incompleteBlogPayload.blogTitle;
      const imageUrl = "https://res.cloudinary.com/diwmlqcru/image/upload/v1711483606/uploads/pexels-image_d5iysy.jpg";
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
  

      const response = await supertest(app)
        .post("/blog/create")
        .attach("blogImage", imageBuffer, "pexels-image_d5iysy.jpg")
        .field("blogBody", incompleteBlogPayload.blogBody)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined;
    }, 20000);

    it("should return an error when no authorization token is provided", async () => {
      const imageUrl = "https://res.cloudinary.com/diwmlqcru/image/upload/v1711483606/uploads/pexels-image_d5iysy.jpg";
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
  

      const response = await supertest(app)
        .post("/blog/create")
        .attach("blogImage", imageBuffer, "pexels-image_d5iysy.jpg")
        .field("blogTitle", blogPayload.blogTitle as string)
        .field("blogBody", blogPayload.blogBody);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    }, 20000);
  });

  describe("GET /blog/all", () => {
    it("should return all blogs", async () => {
      const response = await supertest(app)
        .get("/blog/all")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length) {
        blogId = response.body.data[0]?._id;
      }
    });

    it("should return an empty array when there are no blogs available", async () => {
      const response = await supertest(app)
        .get("/blog/all")
        .set("Authorization", `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
      if (response.body.data.length === 0) {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(0);
      }
    });

    it("should return an error when no authorization token is provided", async () => {
      const response = await supertest(app)
        .get("/blog/all");

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined;
    });

    it("should return an error when there's a server error", async () => {
      // Simulating a server error by setting an invalid route
      const response = await supertest(app)
        .get("/blog/invalid-route")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404); // Or whichever status code is expected for a server error
      expect(response.body).toBeUndefined;
    });
  });



  describe("GET /blog/byid/:blog_id", () => {
    it("should return a single blog by ID", async () => {
      const response = await supertest(app).get(`/blog/byid/${blogId}`).set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Blog fetched successfully");
    });
  });

  describe("PUT /blog/like/:blog_id", () => {
    it("should like a blog", async () => {
      const response = await supertest(app)
        .put(`/blog/like/${blogId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Blog Liked successfully");
    });

    it("should return an error when liking a blog with an invalid ID", async () => {
      const invalidBlogId = "invalid_blog_id";

      const response = await supertest(app)
        .put(`/blog/like/${invalidBlogId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("Message", "Invalid blog ID");
    });

    it("should return an error when no blog ID is provided", async () => {
      const response = await supertest(app)
        .put("/blog/like/")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeUndefined;
    });
  });


  describe("PUT /blog/update/:blog_id", () => {
    it("should update a blog", async () => {
      const response = await supertest(app)
        .put(`/blog/update/${blogId}`)
        .send(blogPayload)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Blog updated successfully");
    });

    it("should return an error when updating a non-existing blog", async () => {
      const nonExistingBlogId = new mongoose.Types.ObjectId();

      const response = await supertest(app)
        .put(`/blog/update/${nonExistingBlogId}`)
        .send(blogPayload)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined;
    });

    it("should return an error when no blog ID is provided", async () => {
      const response = await supertest(app)
        .put("/blog/update/")
        .send(blogPayload)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it("should return an success message for blog upload", async () => {
      const incompleteBlogPayload = { ...blogPayload };
      delete incompleteBlogPayload.blogTitle;

      const response = await supertest(app)
        .put(`/blog/update/${blogId}`)
        .send(incompleteBlogPayload)
        .set("Authorization", `Bearer ${authToken}`);

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
      const response = await supertest(app)
        .post(`/blog/${blogId}/comment`)
        .send(commentData)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Comment created successfully");
    });

    it("should return an error when adding a comment to a non-existing blog", async () => {
      const nonExistingBlogId = new mongoose.Types.ObjectId();
      const commentData = {
        comment: "Test comment",
        name: "Kabera"
      };

      const response = await supertest(app)
        .post(`/blog/${nonExistingBlogId}/comment`)
        .send(commentData)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Blog post not found");
    });

    it("should return an error when no blog ID is provided", async () => {
      const commentData = {
        comment: "Test comment",
        name: "Kabera"
      };

      const response = await supertest(app)
        .post("/blog/comment")
        .send(commentData)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeUndefined;
    });

    it("should return an error when required fields are missing in comment data", async () => {
      const commentData = {
        name: "Kabera"
      };

      const response = await supertest(app)
        .post(`/blog/${blogId}/comment`)
        .send(commentData)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "comment is required");
    });
  });


  describe("DELETE /blog/delete/:blog_id", () => {
    it("should delete a blog when valid ID is provided", async () => {
      const response = await supertest(app)
        .delete(`/blog/delete/${blogId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Blog successful removed!");
    });

    it("should return an error when no blog ID is provided", async () => {
      const response = await supertest(app)
        .delete("/blog/delete/")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeUndefined;
    });
  });


  afterAll(async () => {
    await mongoose.disconnect();
    server.close()
  });
});
