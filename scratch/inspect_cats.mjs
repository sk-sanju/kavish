import { INITIAL_CATEGORIES } from '../src/data/categories.ts';

INITIAL_CATEGORIES.forEach(c => {
  console.log({
    id: c.id,
    name: c.name,
    parentCategory: c.parentCategory,
    slug: c.slug,
    imageType: c.image.startsWith('data:') ? 'base64' : c.image.startsWith('http') ? 'url' : 'empty'
  });
});
