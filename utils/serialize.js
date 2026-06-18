/**
 * Maps Prisma records to MongoDB-compatible API responses (_id fields)
 */

export const toUserResponse = (user) => {
  if (!user) return null;
  const { id, password, ...rest } = user;
  return { _id: id, ...rest };
};

export const toProductResponse = (product) => {
  if (!product) return null;
  const { id, reviews, ...rest } = product;
  return {
    _id: id,
    ...rest,
    reviews: reviews
      ? reviews.map((review) => ({
          _id: review.id,
          user: review.userId,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        }))
      : undefined,
  };
};

export const toOrderResponse = (order) => {
  if (!order) return null;
  const { id, customer, items, ...rest } = order;
  return {
    _id: id,
    ...rest,
    customer: customer
      ? { _id: customer.id, name: customer.name, email: customer.email }
      : undefined,
    products: items
      ? items.map((item) => ({
          product: item.product
            ? {
                _id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
              }
            : item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      : [],
  };
};

export const buildProductSearchFilter = (search) => ({
  OR: [
    { name: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } },
    { category: { contains: search, mode: 'insensitive' } },
  ],
});

export const productInclude = {
  reviews: {
    orderBy: { createdAt: 'desc' },
  },
};

export const orderInclude = {
  customer: {
    select: { id: true, name: true, email: true },
  },
  items: {
    include: {
      product: {
        select: { id: true, name: true, price: true, image: true },
      },
    },
  },
};
