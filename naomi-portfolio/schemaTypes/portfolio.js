// schemas/portfolio.js
export default {
    name: 'portfolio',
    title: 'Portfolio',
    type: 'document',
    fields: [
      {
        name: 'headshot',
        title: 'Headshot',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'images',
        title: 'Portfolio Images',
        type: 'array',
        of: [{ type: 'image' }],
      },
    ],
  };
  