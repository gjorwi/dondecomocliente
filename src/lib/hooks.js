"use client";

import useSWR from "swr";
import { apiFetch } from "./api";
import {
  businesses as mockBusinesses,
  categories as mockCategories,
  getBusinessById,
  getCategoryById,
  getProductsForBusiness,
  products as mockProducts,
} from "./mock-data";
import {
  getAdjustedProductScore,
  getBusinessMetrics,
  getBusinessRecognitions,
  getCategoryRanking,
} from "./scoring";

function buildKey(base, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ).toString();
  return query ? `${base}?${query}` : base;
}

function fallbackCategories() {
  return mockCategories.map((category) => {
    const top = getCategoryRanking(category.id)[0];
    const business = top ? getBusinessById(top.businessId) : null;
    const score = top ? getAdjustedProductScore(top) : null;
    return {
      ...category,
      top: top
        ? {
            product: { ...top, score },
            business,
            score,
            ratingsCount: top.ratingsCount,
          }
        : null,
    };
  });
}

function fallbackBusinesses() {
  return mockBusinesses.map((business) => {
    const metrics = getBusinessMetrics(business.id);
    return {
      ...business,
      score: metrics.score,
      ratingsCount: metrics.ratingsCount,
      ratedProducts: metrics.ratedProducts,
      activeProducts: metrics.activeProducts,
      categories: metrics.categories,
    };
  });
}

function fallbackProducts() {
  return mockProducts.map((product) => ({
    ...product,
    score: getAdjustedProductScore(product),
  }));
}

function fallbackBusinessDetail(slug) {
  const business = getBusinessById(slug);
  if (!business) return null;
  const metrics = getBusinessMetrics(slug);
  const recognition = getBusinessRecognitions(slug)[0];
  return {
    business: {
      ...business,
      score: metrics.score,
      ratingsCount: metrics.ratingsCount,
      ratedProducts: metrics.ratedProducts,
      activeProducts: metrics.activeProducts,
      categories: metrics.categories,
      recognition: recognition
        ? {
            position: recognition.position,
            category: recognition.category.label,
            productName: recognition.product.name,
            city: "Coro",
            status: "validado",
          }
        : null,
    },
    products: getProductsForBusiness(slug).map((product) => ({
      ...product,
      score: getAdjustedProductScore(product),
    })),
  };
}

function fallbackProductDetail(id) {
  const product = mockProducts.find((item) => item.id === id);
  if (!product) return null;
  return {
    product: {
      ...product,
      score: getAdjustedProductScore(product),
    },
    business: getBusinessById(product.businessId),
    category: getCategoryById(product.categoryId),
  };
}

function fallbackRanking(categoryKey) {
  const category = getCategoryById(categoryKey);
  if (!category) return null;
  return {
    category,
    ranking: getCategoryRanking(categoryKey)
      .slice(0, 3)
      .map((product, index) => ({
        position: index + 1,
        product: {
          ...product,
          score: getAdjustedProductScore(product),
        },
        business: getBusinessById(product.businessId),
        score: getAdjustedProductScore(product),
        ratingsCount: product.ratingsCount,
      })),
  };
}

export function useCategories() {
  const { data, error, isLoading } = useSWR("/categories", apiFetch, {
    fallbackData: { categories: fallbackCategories() },
    revalidateOnFocus: false,
  });
  return {
    categories: data?.categories || [],
    error,
    isLoading,
  };
}

export function useBusinesses(params = {}) {
  const key = buildKey("/businesses", params);
  const { data, error, isLoading } = useSWR(key, apiFetch, {
    fallbackData: { businesses: fallbackBusinesses() },
    revalidateOnFocus: false,
  });
  return {
    businesses: data?.businesses || [],
    error,
    isLoading,
  };
}

export function useProducts(params = {}) {
  const key = buildKey("/products", params);
  const { data, error, isLoading } = useSWR(key, apiFetch, {
    fallbackData: { products: fallbackProducts() },
    revalidateOnFocus: false,
  });
  return {
    products: data?.products || [],
    error,
    isLoading,
  };
}

export function useBusiness(slug) {
  const { data, error, isLoading } = useSWR(
    slug ? `/businesses/${slug}` : null,
    apiFetch,
    {
      fallbackData: slug ? fallbackBusinessDetail(slug) : undefined,
      revalidateOnFocus: false,
    },
  );
  return {
    business: data?.business || null,
    products: data?.products || [],
    error,
    isLoading,
  };
}

export function useProduct(id) {
  const { data, error, isLoading } = useSWR(
    id ? `/products/${id}` : null,
    apiFetch,
    {
      fallbackData: id ? fallbackProductDetail(id) : undefined,
      revalidateOnFocus: false,
    },
  );
  return {
    product: data?.product || null,
    business: data?.business || null,
    category: data?.category || null,
    error,
    isLoading,
  };
}

export function useRanking(categoryKey) {
  const { data, error, isLoading } = useSWR(
    categoryKey ? `/rankings/${categoryKey}` : null,
    apiFetch,
    {
      fallbackData: categoryKey ? fallbackRanking(categoryKey) : undefined,
      revalidateOnFocus: false,
    },
  );
  return {
    category: data?.category || null,
    ranking: data?.ranking || [],
    error,
    isLoading,
  };
}
