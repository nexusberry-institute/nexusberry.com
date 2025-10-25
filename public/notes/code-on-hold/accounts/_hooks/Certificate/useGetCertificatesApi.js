import * as qs from "qs-esm";

const getCertificatesApi = async () => {
  try {
    const url = makeUrl();
    const response = await fetch(url, {
      next: {
        // revalidate: 10
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const transformedProducts = await transform(data.data);

    return transformedProducts;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
};

const makeUrl = () => {
  const query = qs.stringify(
    {
      populate: "*",

      // filters: {
      //   course: {
      //     $eq: "All",
      //   },
      // },
    },

    {
      encodeValuesOnly: true,
    }
  );

  return `http://localhost:1337/api/students?${query}`;
};

const transform = (products) => {
  return products.map((product) => {
    let p = { id: product.id, ...product.attributes };

    if (product.attributes.img && product.attributes.img.data) {
      p.img = { imgUrl: product.attributes.img.data.attributes.url };
    }

    if (product.attributes.category && product.attributes.category.data) {
      p.category = {
        id: product.attributes.category.data.id,
        ...product.attributes.category.data.attributes,
      };
    }

    return p;
  });
};

export default getCertificatesApi;
