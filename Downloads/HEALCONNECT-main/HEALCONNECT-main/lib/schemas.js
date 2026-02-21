import { z } from 'zod';

export const doctorRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  specialization: z.string().min(2, { message: "Specialization is required" }),
  license: z.string().min(2, { message: "Medical License Number is required" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }).regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

export const appointmentSchema = z.object({
  name: z.string().min(2, { message: "Patient Name is required" }),
  date: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Appointment date must be in the future",
  }),
  doctor: z.string().min(2, { message: "Doctor's Name is required" }),
});
