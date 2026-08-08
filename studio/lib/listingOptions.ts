export type ListingOption = {
  title: string
  value: string
}

export const marketOptions: ListingOption[] = [
  {title: 'Nigeria', value: 'NG'},
  {title: 'Canada', value: 'CA'},
  {title: 'United States', value: 'US'},
]

export const marketFlags: Record<string, string> = {
  NG: '🇳🇬',
  CA: '🇨🇦',
  US: '🇺🇸',
}

export const defaultCurrencyByMarket: Record<string, string> = {
  NG: 'NGN',
  CA: 'CAD',
  US: 'USD',
}

export const currencyOptions: ListingOption[] = [
  {title: 'Nigerian naira (NGN)', value: 'NGN'},
  {title: 'Canadian dollar (CAD)', value: 'CAD'},
  {title: 'US dollar (USD)', value: 'USD'},
]

export const categoryOptions: ListingOption[] = [
  {title: 'Electronics', value: 'Electronics'},
  {title: 'Appliances', value: 'Appliances'},
  {title: 'Auto Parts', value: 'Auto Parts'},
  {title: 'Vehicles', value: 'Vehicles'},
  {title: 'Other', value: 'Other'},
]

export const conditionOptions: ListingOption[] = [
  {title: 'New', value: 'New'},
  {title: 'Used', value: 'Used'},
  {title: 'Refurbished', value: 'Refurbished'},
]

export const statusOptions: ListingOption[] = [
  {title: 'In stock', value: 'inStock'},
  {title: 'Pending', value: 'pending'},
  {title: 'Sold', value: 'sold'},
]

export function optionTitle(options: ListingOption[], value?: string): string {
  return options.find((option) => option.value === value)?.title || value || 'Not set'
}
