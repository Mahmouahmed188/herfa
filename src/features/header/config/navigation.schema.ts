import { z } from 'zod';

const UserRoleSchema = z.enum(['client', 'technician', 'admin']);

interface NavigationItemValue {
  id: string;
  labelKey: string;
  href: string;
  roles?: string[];
  icon?: string;
  order: number;
  children?: NavigationItemValue[];
  dividerBefore?: boolean;
}

const NavigationItemSchema: z.ZodType<NavigationItemValue> = z.lazy(() =>
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

const NavigationConfigSchema = z.object({
  items: z.array(NavigationItemSchema),
});

export { UserRoleSchema, NavigationItemSchema, NavigationConfigSchema };
export type ValidatedNavigationConfig = z.infer<typeof NavigationConfigSchema>;
