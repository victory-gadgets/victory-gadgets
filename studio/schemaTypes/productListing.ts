import {defineArrayMember, defineField, defineType} from 'sanity'

import {
  categoryOptions,
  conditionOptions,
  currencyOptions,
  defaultCurrencyByMarket,
  marketFlags,
  marketOptions,
  optionTitle,
  statusOptions,
} from '../lib/listingOptions'

type ListingDocument = {
  _id?: string
  isActive?: boolean
  archived?: boolean
  legacyImageUrls?: string[]
}

function formatPrice(price?: number, currency?: string): string {
  if (typeof price !== 'number') return 'Price not set'

  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: currency === 'NGN' ? 0 : 2,
    }).format(price)
  } catch {
    return `${currency || ''} ${price.toLocaleString()}`.trim()
  }
}

export const productListing = defineType({
  name: 'productListing',
  title: 'Product listing',
  type: 'document',
  initialValue: {
    status: 'inStock',
    quantity: 1,
    isActive: false,
    archived: false,
  },
  orderings: [
    {
      title: 'Recently updated',
      name: 'updatedAtDesc',
      by: [{field: '_updatedAt', direction: 'desc'}],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Price: low to high',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
  ],
  groups: [
    {name: 'listing', title: 'Listing', default: true},
    {name: 'inventory', title: 'Market & inventory'},
    {name: 'media', title: 'Photos'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Product name',
      type: 'string',
      group: 'listing',
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      group: 'inventory',
      description: 'A stable, unique identifier such as NG-AS-128.',
      validation: (Rule) => [
        Rule.required()
          .regex(/^[A-Z0-9][A-Z0-9-]{2,39}$/, {
            name: 'uppercase SKU',
            invert: false,
          })
          .error('Use 3–40 uppercase letters, numbers, or hyphens.'),
        Rule.custom(async (sku, context) => {
          if (typeof sku !== 'string' || !sku || !context.document?._id) return true

          const publishedId = context.document._id.replace(/^drafts\./, '')
          const duplicateCount = await context
            .getClient({apiVersion: '2026-01-01'})
            .fetch<number>(
              `count(*[
                _type == "productListing" &&
                sku == $sku &&
                !(_id in [$publishedId, $draftId])
              ])`,
              {sku, publishedId, draftId: `drafts.${publishedId}`},
            )

          return duplicateCount === 0 ? true : 'SKU must be unique across all markets.'
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'listing',
      description: 'Used as the stable storefront URL for this market listing.',
      options: {
        source: (document) => {
          const name = typeof document.name === 'string' ? document.name : ''
          const sku = typeof document.sku === 'string' ? document.sku : ''
          return `${name}-${sku}`
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      group: 'inventory',
      options: {list: marketOptions, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'listing',
      options: {list: categoryOptions},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      group: 'listing',
      options: {list: conditionOptions, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Availability',
      type: 'string',
      group: 'inventory',
      options: {list: statusOptions, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      group: 'inventory',
      description: 'Use 0 for sold listings. Pending inventory may remain above 0.',
      initialValue: 1,
      validation: (Rule) => [
        Rule.required().integer().min(0),
        Rule.custom((quantity, context) => {
          const status = (context.parent as {status?: string} | undefined)?.status

          if (status === 'inStock' && quantity === 0) {
            return 'In-stock listings need a quantity of at least 1.'
          }

          if (status === 'sold' && typeof quantity === 'number' && quantity > 0) {
            return 'Sold listings must have a quantity of 0.'
          }

          return true
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      group: 'inventory',
      description: 'Enter the amount in the market default currency unless an override is selected.',
      validation: (Rule) => Rule.required().positive().precision(2),
    }),
    defineField({
      name: 'currencyOverride',
      title: 'Currency override',
      type: 'string',
      group: 'inventory',
      description: 'Optional. Leave blank to use NGN for Nigeria, CAD for Canada, or USD for the US.',
      options: {list: currencyOptions},
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      group: 'listing',
      validation: (Rule) => Rule.required().min(20).max(2000),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'listing',
      description: 'Short benefit-led points shown on the product page.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) => Rule.required().min(2).max(120),
        }),
      ],
      options: {layout: 'tags'},
      validation: (Rule) => Rule.unique().max(12),
    }),
    defineField({
      name: 'photos',
      title: 'Product photos',
      type: 'array',
      group: 'media',
      description: 'The first photo is the storefront card and social-sharing image.',
      options: {sortable: true},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Describe the product for customers who cannot see the image.',
              validation: (Rule) => Rule.required().min(5).max(180),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (Rule) => Rule.max(180),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.max(12).custom((photos, context) => {
          const document = context.document as ListingDocument | undefined
          const hasUploadedPhoto = Array.isArray(photos) && photos.length > 0
          const hasLegacyPhoto =
            Array.isArray(document?.legacyImageUrls) && document.legacyImageUrls.length > 0

          if (document?.isActive && !hasUploadedPhoto && !hasLegacyPhoto) {
            return 'Active storefront listings need at least one uploaded photo or legacy image URL.'
          }

          return true
        }),
    }),
    defineField({
      name: 'legacyImageUrls',
      title: 'Legacy image URLs',
      type: 'array',
      group: 'media',
      description:
        'Temporary migration fallback for existing hosted images. Upload new photos above whenever possible.',
      of: [
        defineArrayMember({
          type: 'url',
          validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
        }),
      ],
      validation: (Rule) => Rule.unique().max(12),
    }),
    defineField({
      name: 'isActive',
      title: 'Active on storefront',
      type: 'boolean',
      group: 'publishing',
      description: 'Only enabled, non-archived listings should be returned by the public storefront query.',
      initialValue: false,
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((isActive, context) => {
          const document = context.document as ListingDocument | undefined
          return isActive && document?.archived
            ? 'An archived listing cannot also be active on the storefront.'
            : true
        }),
      ],
    }),
    defineField({
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      group: 'publishing',
      description: 'Archive old records instead of deleting them. Deactivate the listing first.',
      initialValue: false,
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((archived, context) => {
          const document = context.document as ListingDocument | undefined
          return archived && document?.isActive
            ? 'Deactivate this listing on the storefront before archiving it.'
            : true
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      sku: 'sku',
      market: 'market',
      status: 'status',
      price: 'price',
      currencyOverride: 'currencyOverride',
      isActive: 'isActive',
      archived: 'archived',
      media: 'photos.0',
    },
    prepare({
      title,
      sku,
      market,
      status,
      price,
      currencyOverride,
      isActive,
      archived,
      media,
    }) {
      const currency = currencyOverride || defaultCurrencyByMarket[market] || 'USD'
      const state = archived ? 'Archived' : isActive ? 'Active' : 'Not active'
      const marketLabel = `${marketFlags[market] || ''} ${optionTitle(marketOptions, market)}`.trim()

      return {
        title: title || 'Untitled product',
        subtitle: [
          marketLabel,
          sku || 'No SKU',
          optionTitle(statusOptions, status),
          formatPrice(price, currency),
          state,
        ].join(' · '),
        media,
      }
    },
  },
})
