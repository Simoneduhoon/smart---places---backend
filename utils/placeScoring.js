exports.getPriceAndRating = (category, userType) => {
  const profiles = {
    student: {
      priceRange: [0, 1],
      ratingRange: [3.5, 4.5]
    },
    professional: {
      priceRange: [1, 3],
      ratingRange: [4.0, 4.8]
    },
    traveler: {
      priceRange: [0, 4],
      ratingRange: [3.8, 5.0]
    }
  };

  const profile = profiles[userType] || profiles.student;

  const price =
    Math.floor(
      Math.random() *
        (profile.priceRange[1] - profile.priceRange[0] + 1)
    ) + profile.priceRange[0];

  const rating = Number(
    (
      Math.random() *
        (profile.ratingRange[1] - profile.ratingRange[0]) +
      profile.ratingRange[0]
    ).toFixed(1)
  );

  return { price, rating };
};
