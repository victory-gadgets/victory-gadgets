import type {StructureResolver} from 'sanity/structure'

import {marketFlags, marketOptions, statusOptions} from '../lib/listingOptions'

const currentFilter = '_type == "productListing" && market == $market && archived != true'

export const inventoryStructure: StructureResolver = (S) =>
  S.list()
    .title('Victory Gadgets inventory')
    .items([
      ...marketOptions.map((market) =>
        S.listItem()
          .id(`market-${market.value.toLowerCase()}`)
          .title(`${marketFlags[market.value]} ${market.title}`)
          .child(
            S.list()
              .id(`market-${market.value.toLowerCase()}-inventory`)
              .title(`${market.title} inventory`)
              .items([
                S.listItem()
                  .id(`${market.value.toLowerCase()}-current`)
                  .title('All non-archived listings')
                  .child(
                    S.documentList()
                      .id(`${market.value.toLowerCase()}-current-documents`)
                      .title('All non-archived listings')
                      .schemaType('productListing')
                      .filter(currentFilter)
                      .params({market: market.value})
                      .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                  ),
                ...statusOptions.map((status) =>
                  S.listItem()
                    .id(`${market.value.toLowerCase()}-${status.value.toLowerCase()}`)
                    .title(status.title)
                    .child(
                      S.documentList()
                        .id(
                          `${market.value.toLowerCase()}-${status.value.toLowerCase()}-documents`,
                        )
                        .title(`${market.title}: ${status.title}`)
                        .schemaType('productListing')
                        .filter(`${currentFilter} && status == $status`)
                        .params({market: market.value, status: status.value})
                        .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                    ),
                ),
                S.divider(),
                S.listItem()
                  .id(`${market.value.toLowerCase()}-inactive`)
                  .title('Not active on storefront')
                  .child(
                    S.documentList()
                      .id(`${market.value.toLowerCase()}-inactive-documents`)
                      .title(`${market.title}: not active on storefront`)
                      .schemaType('productListing')
                      .filter(`${currentFilter} && isActive != true`)
                      .params({market: market.value})
                      .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                  ),
                S.listItem()
                  .id(`${market.value.toLowerCase()}-archived`)
                  .title('Archived')
                  .child(
                    S.documentList()
                      .id(`${market.value.toLowerCase()}-archived-documents`)
                      .title(`${market.title}: archived`)
                      .schemaType('productListing')
                      .filter('_type == "productListing" && market == $market && archived == true')
                      .params({market: market.value})
                      .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                  ),
              ]),
          ),
      ),
      S.divider(),
      S.documentTypeListItem('productListing').title('All listings'),
    ])
