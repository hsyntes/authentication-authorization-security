module.exports = (body, ...allowedFields) => {
  const newBody = {};

  Object.keys(body).forEach((key) => {
    if (allowedFields.includes(key)) newBody[key] = body[key];
  });

  return newBody;
};
