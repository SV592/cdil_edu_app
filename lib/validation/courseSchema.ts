import { z } from 'zod';

// Helper function for nullable strings with max length validation
// Apply validation BEFORE transform to avoid type issues
const nullableString = (maxLength: number) =>
  z.string()
    .max(maxLength)
    .transform((val) => val === '' ? null : val)
    .nullable();

// For fields without max length constraint
const emptyStringToNull = z.string()
  .transform((val) => val === '' ? null : val)
  .nullable();

export const courseFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  courseCode: z.string().min(1, 'Course code is required').max(20, 'Course code must be less than 20 characters'),
  description: z.string().min(1, 'Description is required'),

  departmentId: z.number().int().positive().nullable(),
  program: nullableString(100),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).nullable().or(
    z.literal('').transform(() => null)
  ),
  creditHours: z.number().int().positive().max(10).nullable(),

  startDate: z.coerce.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Invalid start date',
  }),
  endDate: z.coerce.date({
    required_error: 'End date is required',
    invalid_type_error: 'Invalid end date',
  }),
  durationWeeks: z.number().int().positive().max(52).nullable(),

  deliveryMode: z.enum(['online', 'in_person', 'hybrid'], {
    required_error: 'Delivery mode is required',
  }),
  location: z.string().nullable().optional(),
  campus: nullableString(100),

  maxEnrollment: z.number().int().positive().max(1000).nullable(),
  learningOutcomes: emptyStringToNull,
  prerequisites: emptyStringToNull,
  language: z.string().min(1, 'Language is required').default('English'),

  status: z.enum(['draft', 'active', 'archived', 'completed']).default('draft'),
})
.refine(
  (data) => data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
)
.superRefine((data, ctx) => {
  // Conditionally validate location based on delivery mode
  if (data.deliveryMode === 'in_person' || data.deliveryMode === 'hybrid') {
    if (!data.location || data.location.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Location is required for in-person and hybrid courses',
        path: ['location'],
      });
    } else if (data.location.length > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Location must be less than 200 characters',
        path: ['location'],
      });
    }
  }
});

export type CourseFormData = z.infer<typeof courseFormSchema>;
