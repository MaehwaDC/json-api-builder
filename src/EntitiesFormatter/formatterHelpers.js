
export const publicationBuilder = ({ type: publicationType, attrType, ...otherData }) => ({
  ...otherData,
  publicationType,
  type: attrType,
});
