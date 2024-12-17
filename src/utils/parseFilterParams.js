const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['personal', 'home', 'work'].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseFavourite = (Favourite) => {
  const isString = typeof Favourite === 'string';
  if (!isString) return;

  const isFavourite = (Favourite) => ['true', 'false'].includes(Favourite);

  if (isFavourite(Favourite)) return Favourite;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseContactType(contactType);
  const parsedIsFavourite = parseFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
