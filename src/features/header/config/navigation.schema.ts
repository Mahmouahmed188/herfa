import { z } from 'zod';

const UserRoleSchema = z.enum(['client', 'technician', 'admin']);

const NavigationItemSchema: z.ZodType<NavigationItemSchemaType> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    labelKey: z.string().min(1),
    href: z.string().min(1),
    roles: z.array(UserRoleSchema).optional(),
    icon: z.string().optional(),
    order: z.number().int().nonnegative(),
    children: z.array(NavigationItemSchema).optional(),
    dividerBefore: z.boolean().optional(),
  })
);

type NavigationItemSchemaType = z.infer<typeof NavigationItemSchema>;

const NavigationConfigSchema = z.object({
  items: z.array(NavigationItemSchema),
});

export { UserRoleSchema, NavigationItemSchema, NavigationConfigSchema };
export type ValidatedNavigationConfig = z.infer<typeof NavigationConfigSchema>;
