import { z } from 'zod';

const eventSchema = z.object({
  heading: z
    .string({ message: "Event name is required" })
    .min(2, { message: "Event name must be at least 2 characters" })
    .max(30, { message: "Event name must not be more than 20 characters" }),
  description: z
    .string({ message: "Event description is required" })
    .min(50, { message: "Event description must be at least 50 characters" })
    .max(1000, {
      message: "Event description must not be more than 1000 characters",
    }),
  poster: z.string({message: "Poster is required"}),
  banner: z.string({message : "Banner is required"}),
  event_date: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Event date must be a valid date"
    ),
  event_time: z.string({message : "Event time is required"}),
  registration_end: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Registration end date must be a valid date"
    ),
  venue: z
    .string({ message: "Venue is required" })
    .min(10, { message: "Event heading must be at least 10 characters" })
    .max(30, {
      message: "Event heading must not be more than 30 characters",
    }),
  postedBy: z.string({ message: "Posted by is required" }),
});

export default eventSchema;
