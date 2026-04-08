import type { Meta, StoryObj } from '@storybook/react-vite';
import { toCapitalize, toSnakeCase, toCamelCase } from '@masan-group/utils';
import { LabelValue } from '@masan-group/shared-ui/label-value';

/**
 * String transformation utility functions.
 */
const meta = {
  title: 'Utils/string',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'String transformation functions for capitalization and case conversion.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * toCapitalize - Capitalize first letter or all words
 */
export const ToCapitalize: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toCapitalize('hello world')">{toCapitalize('hello world')}</LabelValue>
      <LabelValue label="toCapitalize('hello world', false)">
        {toCapitalize('hello world', false)}
      </LabelValue>
      <LabelValue label="toCapitalize('hello world', true)">
        {toCapitalize('hello world', true)}
      </LabelValue>
      <LabelValue label="toCapitalize('HELLO WORLD')">{toCapitalize('HELLO WORLD')}</LabelValue>
      <LabelValue label="toCapitalize('hello_world')">{toCapitalize('hello_world')}</LabelValue>
      <LabelValue label="toCapitalize('hello_world', true)">
        {toCapitalize('hello_world', true)}
      </LabelValue>
      <LabelValue label="toCapitalize('multiple words here', true)">
        {toCapitalize('multiple words here', true)}
      </LabelValue>
    </div>
  ),
};

/**
 * toSnakeCase - Convert to snake_case
 */
export const ToSnakeCase: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toSnakeCase('Hello World')">{toSnakeCase('Hello World')}</LabelValue>
      <LabelValue label="toSnakeCase('hello world')">{toSnakeCase('hello world')}</LabelValue>
      <LabelValue label="toSnakeCase('HelloWorld')">{toSnakeCase('HelloWorld')}</LabelValue>
      <LabelValue label="toSnakeCase('Multiple Words Here')">
        {toSnakeCase('Multiple Words Here')}
      </LabelValue>
      <LabelValue label="toSnakeCase('camelCase')">{toSnakeCase('camelCase')}</LabelValue>
    </div>
  ),
};

/**
 * toCamelCase - Convert to camelCase
 */
export const ToCamelCase: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toCamelCase('Hello World')">{toCamelCase('Hello World')}</LabelValue>
      <LabelValue label="toCamelCase('hello world')">{toCamelCase('hello world')}</LabelValue>
      <LabelValue label="toCamelCase('Multiple Words Here')">
        {toCamelCase('Multiple Words Here')}
      </LabelValue>
      <LabelValue label="toCamelCase('snake_case')">{toCamelCase('snake_case')}</LabelValue>
    </div>
  ),
};

/**
 * Edge cases with null and undefined
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toCapitalize(null)">{toCapitalize(null) || '(empty string)'}</LabelValue>
      <LabelValue label="toCapitalize(undefined)">
        {toCapitalize(undefined) || '(empty string)'}
      </LabelValue>
      <LabelValue label="toSnakeCase(null)">{toSnakeCase(null) || '(empty string)'}</LabelValue>
      <LabelValue label="toSnakeCase(undefined)">
        {toSnakeCase(undefined) || '(empty string)'}
      </LabelValue>
      <LabelValue label="toCamelCase(null)">{toCamelCase(null) || '(empty string)'}</LabelValue>
      <LabelValue label="toCamelCase(undefined)">
        {toCamelCase(undefined) || '(empty string)'}
      </LabelValue>
      <LabelValue label="toCapitalize('')">{toCapitalize('') || '(empty string)'}</LabelValue>
      <LabelValue label="toCapitalize('  ')}">{toCapitalize('  ') || '(empty string)'}</LabelValue>
    </div>
  ),
};

/**
 * Real-world examples
 */
export const RealWorldExamples: Story = {
  render: () => {
    const examples = [
      { input: 'user_name', description: 'Database field name' },
      { input: 'first name', description: 'Form field label' },
      { input: 'API_KEY', description: 'Environment variable' },
      { input: 'product category', description: 'Display label' },
    ];

    return (
      <div className="w-[600px] space-y-6">
        {examples.map((example) => (
          <div key={example.input} className="rounded-lg border bg-muted p-4">
            <h3 className="mb-3 font-semibold">{example.description}</h3>
            <div className="space-y-2">
              <LabelValue label="Input">{example.input}</LabelValue>
              <LabelValue label="Capitalized (first word)">
                {toCapitalize(example.input)}
              </LabelValue>
              <LabelValue label="Capitalized (all words)">
                {toCapitalize(example.input, true)}
              </LabelValue>
              <LabelValue label="Snake Case">{toSnakeCase(example.input)}</LabelValue>
              <LabelValue label="Camel Case">{toCamelCase(example.input)}</LabelValue>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Comparison of all functions
 */
export const Comparison: Story = {
  render: () => {
    const testStrings = [
      'hello world',
      'HELLO WORLD',
      'hello_world',
      'helloWorld',
      'multiple words here',
    ];

    return (
      <div className="w-[700px] space-y-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Input</th>
              <th className="p-2 text-left">toCapitalize</th>
              <th className="p-2 text-left">toCapitalize (all)</th>
              <th className="p-2 text-left">toSnakeCase</th>
              <th className="p-2 text-left">toCamelCase</th>
            </tr>
          </thead>
          <tbody>
            {testStrings.map((str) => (
              <tr key={str} className="border-b">
                <td className="p-2 font-mono text-sm">{str}</td>
                <td className="p-2 font-mono text-sm">{toCapitalize(str)}</td>
                <td className="p-2 font-mono text-sm">{toCapitalize(str, true)}</td>
                <td className="p-2 font-mono text-sm">{toSnakeCase(str)}</td>
                <td className="p-2 font-mono text-sm">{toCamelCase(str)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
