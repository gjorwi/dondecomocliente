import { businesses, categories, products } from './mock-data';

const BAYESIAN_PRIOR_WEIGHT = 10;
export const MIN_RATINGS_FOR_RANKING = 5;

export function getAdjustedProductScore(product) {
  if (!product) return null;
  if (typeof product.score === "number") return product.score;
  if (!product.ratingsCount || product.ratingsCount < 0) return null;

  const category = categories.find((item) => item.id === product.categoryId);
  const categoryAverage = category?.average ?? 4;
  const count = product.ratingsCount;
  const productAverage = product.averageScore ?? categoryAverage;

  return (count / (count + BAYESIAN_PRIOR_WEIGHT)) * productAverage
    + (BAYESIAN_PRIOR_WEIGHT / (count + BAYESIAN_PRIOR_WEIGHT)) * categoryAverage;
}

export function getCategoryRanking(categoryId, sourceProducts = products) {
  return sourceProducts
    .filter((product) => (
      product.categoryId === categoryId
      && product.isActive !== false
      && product.ratingsCount >= MIN_RATINGS_FOR_RANKING
    ))
    .map((product) => ({ ...product, score: getAdjustedProductScore(product) }))
    .sort((a, b) => b.score - a.score || b.ratingsCount - a.ratingsCount);
}

export function getBusinessMetrics(businessId, sourceProducts = products) {
  const businessProducts = sourceProducts.filter(
    (product) => product.businessId === businessId && product.isActive !== false,
  );
  const ratedProducts = businessProducts.filter((product) => product.ratingsCount > 0);

  if (ratedProducts.length === 0) {
    return {
      score: null,
      ratingsCount: 0,
      ratedProducts: 0,
      activeProducts: businessProducts.length,
      categories: [],
    };
  }

  const adjustedScores = ratedProducts.map(getAdjustedProductScore);
  const score = adjustedScores.reduce((total, value) => total + value, 0) / adjustedScores.length;
  const categoryScores = categories
    .map((category) => {
      const categoryProducts = ratedProducts.filter((product) => product.categoryId === category.id);
      if (categoryProducts.length === 0) return null;
      const categoryScore = categoryProducts
        .map(getAdjustedProductScore)
        .reduce((total, value) => total + value, 0) / categoryProducts.length;
      return { ...category, score: categoryScore, productsCount: categoryProducts.length };
    })
    .filter(Boolean);

  return {
    score,
    ratingsCount: ratedProducts.reduce((total, product) => total + product.ratingsCount, 0),
    ratedProducts: ratedProducts.length,
    activeProducts: businessProducts.length,
    categories: categoryScores,
  };
}

export function getBusinessRecognitions(businessId) {
  const recognitions = [];

  categories.forEach((category) => {
    const ranking = getCategoryRanking(category.id);
    const position = ranking.findIndex((product) => product.businessId === businessId);
    if (position >= 0 && position < 3) {
      recognitions.push({
        category,
        position: position + 1,
        product: ranking[position],
      });
    }
  });

  return recognitions;
}

export function formatScore(score) {
  return typeof score === 'number' ? score.toFixed(1).replace('.', ',') : '—';
}

export function getBusinessScore(businessId) {
  return getBusinessMetrics(businessId).score;
}

export function getBusinessForProduct(product) {
  return businesses.find((business) => business.id === product?.businessId);
}
