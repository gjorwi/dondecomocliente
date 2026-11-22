"use client";

import useSWR from "swr";
import { apiFetch } from "./api";

function buildKey(base, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ).toString();
  return query ? `${base}?${query}` : base;
}

export function useCategories() {
  const { data, error, isLoading } = useSWR("/categories", apiFetch, {
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
    { revalidateOnFocus: false },
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
    { revalidateOnFocus: false },
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
    { revalidateOnFocus: false },
  );
  return {
    category: data?.category || null,
    ranking: data?.ranking || [],
    error,
    isLoading,
  };
}

export function usePromotions() {
  const { data, error, isLoading } = useSWR("/promotions", apiFetch, {
    revalidateOnFocus: false,
  });
  return {
    promotions: data?.promotions || [],
    error,
    isLoading,
  };
}
