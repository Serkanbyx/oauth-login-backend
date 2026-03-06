const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "OAuth Login Backend API",
      version: "1.0.0",
      description:
        "REST API with Google & GitHub OAuth2 authentication using Passport.js, Express 5, and MongoDB.",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    tags: [
      { name: "Root", description: "API root information" },
      { name: "Auth", description: "OAuth2 authentication endpoints" },
      { name: "User", description: "User profile & listing endpoints" },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a1b2c3d4e5f67890abcdef",
            },
            provider: {
              type: "string",
              enum: ["google", "github"],
              example: "google",
            },
            providerId: {
              type: "string",
              example: "117234567890123456789",
            },
            displayName: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              nullable: true,
              example: "john@example.com",
            },
            avatar: {
              type: "string",
              nullable: true,
              example: "https://lh3.googleusercontent.com/a/photo.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-06T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-06T12:00:00.000Z",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
