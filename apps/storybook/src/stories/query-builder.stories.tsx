import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  QueryBuilder,
  QueryBuilderShadcn,
  formatQuery,
  type Field,
  type RuleGroupType,
} from '@masan-group/shared-ui/query-builder';

/**
 * QueryBuilder with shadcn/ui styling for building complex filter conditions.
 * Built on react-querybuilder with custom shadcn/ui controls.
 */
const meta: Meta<typeof QueryBuilder> = {
  title: 'ui/QueryBuilder',
  component: QueryBuilder,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <QueryBuilderShadcn>
        <Story />
      </QueryBuilderShadcn>
    ),
  ],
} satisfies Meta<typeof QueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample fields for stories
const sampleFields: Field[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  {
    name: 'age',
    label: 'Age',
    inputType: 'number',
  },
  {
    name: 'status',
    label: 'Status',
    valueEditorType: 'select',
    values: [
      { name: 'active', label: 'Active' },
      { name: 'inactive', label: 'Inactive' },
      { name: 'pending', label: 'Pending' },
    ],
  },
];

// Buy promotion fields
const buyPromotionFields: Field[] = [
  {
    name: 'scheme',
    label: 'Scheme',
    valueEditorType: 'select',
    values: [
      { name: '1-GIẢM GIÁ', label: '1-GIẢM GIÁ' },
      { name: '2-CLAIMBACK', label: '2-CLAIMBACK' },
      { name: '3-CLAIMBACK&GIẢM GIÁ', label: '3-CLAIMBACK&GIẢM GIÁ' },
      { name: '4-CLAIMBACK&BÓ KÈM', label: '4-CLAIMBACK&BÓ KÈM' },
      { name: '5-BÓ KÈM', label: '5-BÓ KÈM' },
    ],
  },
  { name: 'priceDiscounted', label: 'Price Discounted (VND)', inputType: 'number' },
  { name: 'appliedQtyFreeGoods', label: 'Applied Qty Free Goods', inputType: 'number' },
  { name: 'freeGoodsQty', label: 'Free Goods Qty', inputType: 'number' },
  {
    name: 'claimbackType',
    label: 'Claimback Type',
    valueEditorType: 'select',
    values: [
      { name: '1-Mua', label: '1-Mua' },
      { name: '2-Bán', label: '2-Bán' },
    ],
  },
  { name: 'claimbackValue', label: 'Claimback Value (VND)', inputType: 'number' },
];

// Sell promotion fields
const sellPromotionFields: Field[] = [
  {
    name: 'scheme',
    label: 'Scheme',
    valueEditorType: 'select',
    values: [
      { name: '1-GIẢM GIÁ', label: '1-GIẢM GIÁ' },
      { name: '7-MUA A TẶNG A', label: '7-MUA A TẶNG A' },
      { name: '8-MUA A TẶNG B', label: '8-MUA A TẶNG B' },
      { name: '9-VOUCHER', label: '9-VOUCHER' },
    ],
  },
  { name: 'code', label: 'Code' },
  { name: 'name', label: 'Name' },
  { name: 'uom', label: 'UOM' },
  { name: 'priceDiscounted', label: 'Price Discounted (VND)', inputType: 'number' },
  { name: 'appliedQtyFreeGoods', label: 'Applied Qty Free Goods', inputType: 'number' },
  { name: 'freeGoodsQty', label: 'Free Goods Qty', inputType: 'number' },
  {
    name: 'claimbackType',
    label: 'Claimback Type',
    valueEditorType: 'select',
    values: [
      { name: '1-Mua', label: '1-Mua' },
      { name: '2-Bán', label: '2-Bán' },
    ],
  },
  { name: 'claimbackValue', label: 'Claimback Value (VND)', inputType: 'number' },
];

const defaultQuery: RuleGroupType = {
  combinator: 'and',
  rules: [],
};

const prefilledQuery: RuleGroupType = {
  combinator: 'and',
  rules: [
    { field: 'firstName', operator: 'contains', value: 'John' },
    { field: 'age', operator: '>', value: 25 },
  ],
};

/**
 * Basic QueryBuilder with minimal configuration.
 */
export const Default: Story = {
  args: {
    fields: sampleFields,
    query: defaultQuery,
    onQueryChange: fn(),
  },
};

/**
 * QueryBuilder with pre-filled rules.
 */
export const WithRules: Story = {
  args: {
    fields: sampleFields,
    query: prefilledQuery,
    onQueryChange: fn(),
  },
};

/**
 * QueryBuilder with all features enabled.
 */
export const FullFeatures: Story = {
  args: {
    fields: sampleFields,
    query: defaultQuery,
    onQueryChange: fn(),
    showCombinatorsBetweenRules: true,
    showNotToggle: true,
    addRuleToNewGroups: true,
    resetOnFieldChange: true,
  },
};

/**
 * Interactive example with SQL preview.
 */
export const WithSQLPreview: Story = {
  render: () => {
    const [query, setQuery] = useState<RuleGroupType>(prefilledQuery);
    const sql = formatQuery(query, 'sql');

    return (
      <div className="space-y-4">
        <QueryBuilder
          fields={sampleFields}
          query={query}
          onQueryChange={setQuery}
          showCombinatorsBetweenRules
          showNotToggle
          addRuleToNewGroups
        />
        {query.rules.length > 0 && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 font-medium text-sm">Generated SQL:</p>
            <code className="block whitespace-pre-wrap text-muted-foreground text-sm">{sql}</code>
          </div>
        )}
      </div>
    );
  },
};

/**
 * QueryBuilder for Buy Promotion filtering.
 */
export const BuyPromotionFilter: Story = {
  render: () => {
    const [query, setQuery] = useState<RuleGroupType>({
      combinator: 'and',
      rules: [
        { field: 'scheme', operator: '=', value: '2-CLAIMBACK' },
        { field: 'priceDiscounted', operator: '>', value: 10000 },
      ],
    });
    const sql = formatQuery(query, 'sql');

    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Buy Promotion Filter</h3>
          <p className="text-muted-foreground text-sm">
            Build conditions for Buy promotion schemes (supplier-facing).
          </p>
        </div>
        <QueryBuilder
          fields={buyPromotionFields}
          query={query}
          onQueryChange={setQuery}
          showCombinatorsBetweenRules
          showNotToggle
          addRuleToNewGroups
          resetOnFieldChange
        />
        {query.rules.length > 0 && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 font-medium text-sm">Generated SQL:</p>
            <code className="block whitespace-pre-wrap text-muted-foreground text-sm">{sql}</code>
          </div>
        )}
      </div>
    );
  },
};

/**
 * QueryBuilder for Sell Promotion filtering.
 */
export const SellPromotionFilter: Story = {
  render: () => {
    const [query, setQuery] = useState<RuleGroupType>({
      combinator: 'or',
      rules: [
        { field: 'scheme', operator: '=', value: '9-VOUCHER' },
        {
          combinator: 'and',
          rules: [
            { field: 'freeGoodsQty', operator: '>', value: 0 },
            { field: 'appliedQtyFreeGoods', operator: '>=', value: 1 },
          ],
        },
      ],
    });
    const sql = formatQuery(query, 'sql');

    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Sell Promotion Filter</h3>
          <p className="text-muted-foreground text-sm">
            Build conditions for Sell promotion schemes (customer-facing).
          </p>
        </div>
        <QueryBuilder
          fields={sellPromotionFields}
          query={query}
          onQueryChange={setQuery}
          showCombinatorsBetweenRules
          showNotToggle
          addRuleToNewGroups
          resetOnFieldChange
        />
        {query.rules.length > 0 && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 font-medium text-sm">Generated SQL:</p>
            <code className="block whitespace-pre-wrap text-muted-foreground text-sm">{sql}</code>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Complex nested query example.
 */
export const NestedGroups: Story = {
  render: () => {
    const [query, setQuery] = useState<RuleGroupType>({
      combinator: 'and',
      rules: [
        { field: 'status', operator: '=', value: 'active' },
        {
          combinator: 'or',
          rules: [
            { field: 'firstName', operator: 'contains', value: 'John' },
            { field: 'lastName', operator: 'contains', value: 'Doe' },
          ],
        },
        { field: 'age', operator: 'between', value: '25,50' },
      ],
    });
    const sql = formatQuery(query, 'sql');

    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Complex Nested Query</h3>
          <p className="text-muted-foreground text-sm">
            Demonstrates nested groups with AND/OR combinators.
          </p>
        </div>
        <QueryBuilder
          fields={sampleFields}
          query={query}
          onQueryChange={setQuery}
          showCombinatorsBetweenRules
          showNotToggle
          addRuleToNewGroups
          resetOnFieldChange
        />
        {query.rules.length > 0 && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 font-medium text-sm">Generated SQL:</p>
            <code className="block whitespace-pre-wrap text-muted-foreground text-sm">{sql}</code>
          </div>
        )}
      </div>
    );
  },
};
