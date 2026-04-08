import type { Meta, StoryObj } from '@storybook/react-vite';
import { joinStringArray } from '@masan-group/utils';
import { LabelValue } from '@masan-group/shared-ui/label-value';

/**
 * Utility function to join string arrays with a separator, filtering out falsy values.
 */
const meta = {
  title: 'Utils/joinStringArray',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Joins an array of strings with a separator, filtering out false, null, undefined, and empty string values.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic usage with default separator
 */
export const BasicUsage: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="joinStringArray(['apple', 'banana', 'cherry'])">
        {joinStringArray(['apple', 'banana', 'cherry'])}
      </LabelValue>
      <LabelValue label="joinStringArray(['apple', 'banana', 'cherry'], ', ')">
        {joinStringArray(['apple', 'banana', 'cherry'], ', ')}
      </LabelValue>
      <LabelValue label="joinStringArray(['apple', 'banana', 'cherry'], ' | ')">
        {joinStringArray(['apple', 'banana', 'cherry'], ' | ')}
      </LabelValue>
    </div>
  ),
};

/**
 * Filtering out falsy values
 */
export const FilteringFalsyValues: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="With empty strings">
        {joinStringArray(['apple', '', 'banana', '', 'cherry'])}
      </LabelValue>
      <LabelValue label="With null values">
        {joinStringArray(['apple', null, 'banana', null, 'cherry'])}
      </LabelValue>
      <LabelValue label="With undefined values">
        {joinStringArray(['apple', undefined, 'banana', undefined, 'cherry'])}
      </LabelValue>
      <LabelValue label="With false values">
        {joinStringArray(['apple', false, 'banana', false, 'cherry'])}
      </LabelValue>
      <LabelValue label="Mixed falsy values">
        {joinStringArray(['apple', '', null, undefined, false, 'banana', 'cherry'])}
      </LabelValue>
    </div>
  ),
};

/**
 * Custom separators
 */
export const CustomSeparators: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Comma separator">
        {joinStringArray(['apple', 'banana', 'cherry'], ',')}
      </LabelValue>
      <LabelValue label="Semicolon separator">
        {joinStringArray(['apple', 'banana', 'cherry'], ';')}
      </LabelValue>
      <LabelValue label="Pipe separator">
        {joinStringArray(['apple', 'banana', 'cherry'], ' | ')}
      </LabelValue>
      <LabelValue label="Newline separator">
        <pre>{joinStringArray(['apple', 'banana', 'cherry'], '\n')}</pre>
      </LabelValue>
      <LabelValue label="Empty separator">
        {joinStringArray(['apple', 'banana', 'cherry'], '')}
      </LabelValue>
    </div>
  ),
};

/**
 * With numbers and mixed types
 */
export const WithNumbers: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Number array">{joinStringArray([1, 2, 3], ', ')}</LabelValue>
      <LabelValue label="Mixed types">
        {joinStringArray(['apple', 1, 'banana', 2, 'cherry'], ', ')}
      </LabelValue>
      <LabelValue label="With zero">
        {joinStringArray(['apple', 0, 'banana', 'cherry'], ', ')}
      </LabelValue>
    </div>
  ),
};

/**
 * Edge cases
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Empty array">{joinStringArray([], ', ') || '(empty string)'}</LabelValue>
      <LabelValue label="Null array">{joinStringArray(null, ', ') || '(empty string)'}</LabelValue>
      <LabelValue label="Undefined array">
        {joinStringArray(undefined, ', ') || '(empty string)'}
      </LabelValue>
      <LabelValue label="All falsy values">
        {joinStringArray([null, undefined, '', false], ', ') || '(empty string)'}
      </LabelValue>
      <LabelValue label="Single item">{joinStringArray(['apple'], ', ')}</LabelValue>
    </div>
  ),
};

/**
 * Real-world example: Tags display
 */
export const RealWorldExample: Story = {
  render: () => {
    const tags = ['react', 'typescript', '', 'storybook', null, 'ui', undefined];

    return (
      <div className="w-96 space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Tags Display</h3>
          <div className="rounded-lg border bg-muted p-4">
            <LabelValue label="Tags">{joinStringArray(tags, ', ') || 'No tags'}</LabelValue>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-lg">Tags with custom separator</h3>
          <div className="rounded-lg border bg-muted p-4">
            <LabelValue label="Tags">{joinStringArray(tags, ' • ') || 'No tags'}</LabelValue>
          </div>
        </div>
      </div>
    );
  },
};
