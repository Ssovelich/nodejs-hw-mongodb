const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['personal', 'home', 'work'].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;

  const isBoolean = (isFavourite) => ['true', 'false'].includes(isFavourite);

  if (isBoolean(isFavourite)) return isFavourite;
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
