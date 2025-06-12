const z = require("zod");

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  age: z.number().int().positive("Age must be a positive integer"),
  email: z.string().email("Invalid email format"),
});

module.exports = { studentSchema };
