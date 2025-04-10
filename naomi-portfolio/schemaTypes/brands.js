// schemas/brands.js
export default {
    name: 'brands',
    title: 'Brands',
    type: 'document',
    fields: [
      {
        name: 'logo',
        title: 'Brand Logo',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
    ],
  };
  