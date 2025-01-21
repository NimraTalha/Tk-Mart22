import { defineType, defineField } from "sanity";

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name', // Generate slug from the category name
        maxLength: 96,
      },
      validation: Rule => Rule.required().custom(slug => {
        if (slug && slug.current) {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)
            ? true
            : 'Slug must be lowercase and hyphenated';
        }
        return true;
      }),
    }),
    defineField({
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],  // Allow reference to another category (parent-child structure)
    }),
  ],
});
