import payload from 'payload';

export const fetchCollections = async () => {
  const allCollections = await payload.collections;
  return Object.keys(allCollections).map((slug: string) => ({
    label: allCollections[slug as keyof typeof allCollections].config.labels.singular,
    value: slug,
  }));
};

