import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '@masan-group/shared-ui/button';
import { Input } from '@masan-group/shared-ui/input';
import { Label } from '@masan-group/shared-ui/label';
import { useControlledState } from '@masan-group/shared-ui';

/**
 * Hook to manage controlled/uncontrolled state for form controls.
 *
 * This hook simplifies the implementation of components that can work in both
 * controlled and uncontrolled modes, following React's standard pattern.
 */
const meta = {
  title: 'Hooks/useControlledState',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A hook that manages state for components that can be either controlled or uncontrolled. When `value` is provided, the component is controlled. When only `defaultValue` is provided, it manages internal state.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Controlled mode: The parent component manages the state.
 * Changes are handled through the `onChange` callback.
 */
export const Controlled: Story = {
  render: () => {
    const [parentValue, setParentValue] = useState<string>('Hello');
    const [value, setValue] = useControlledState({
      value: parentValue,
      onChange: (newValue) => {
        setParentValue(newValue ?? '');
        action('onChange')(newValue);
      },
    });

    return (
      <div className="flex w-80 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="controlled-input">Controlled Input</Label>
          <Input
            id="controlled-input"
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something..."
          />
          <p className="text-muted-foreground text-sm">
            Parent state: <strong>{parentValue}</strong>
          </p>
          <p className="text-muted-foreground text-sm">
            Hook value: <strong>{value ?? 'undefined'}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setParentValue('Reset from parent')}>
            Reset from Parent
          </Button>
          <Button variant="outline" onClick={() => setValue('Reset from hook')}>
            Reset from Hook
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Uncontrolled mode: The hook manages internal state.
 * Initial value is set via `defaultValue`.
 */
export const Uncontrolled: Story = {
  render: () => {
    const [value, setValue] = useControlledState({
      defaultValue: 'Initial value',
    });

    return (
      <div className="flex w-80 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="uncontrolled-input">Uncontrolled Input</Label>
          <Input
            id="uncontrolled-input"
            value={value ?? ''}
            onChange={(e) => {
              setValue(e.target.value);
              action('value changed')(e.target.value);
            }}
            placeholder="Type something..."
          />
          <p className="text-muted-foreground text-sm">
            Hook value: <strong>{value ?? 'undefined'}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setValue('Reset value')}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => setValue(undefined)}>
            Clear
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Comparison: Side-by-side demonstration of controlled vs uncontrolled modes.
 */
export const Comparison: Story = {
  render: () => {
    const [controlledValue, setControlledValue] = useState<string>('Controlled');
    const [controlled, setControlled] = useControlledState({
      value: controlledValue,
      onChange: (newValue) => {
        setControlledValue(newValue ?? '');
        action('controlled onChange')(newValue);
      },
    });

    const [uncontrolled, setUncontrolled] = useControlledState({
      defaultValue: 'Uncontrolled',
    });

    return (
      <div className="flex w-[600px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Controlled Mode</h3>
          <Label htmlFor="controlled">Controlled Input</Label>
          <Input
            id="controlled"
            value={controlled ?? ''}
            onChange={(e) => setControlled(e.target.value)}
            placeholder="Parent manages state..."
          />
          <p className="text-muted-foreground text-sm">
            Parent state: <strong>{controlledValue}</strong>
          </p>
          <p className="text-muted-foreground text-xs">
            Changes propagate to parent via onChange callback
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Uncontrolled Mode</h3>
          <Label htmlFor="uncontrolled">Uncontrolled Input</Label>
          <Input
            id="uncontrolled"
            value={uncontrolled ?? ''}
            onChange={(e) => {
              setUncontrolled(e.target.value);
              action('uncontrolled onChange')(e.target.value);
            }}
            placeholder="Hook manages state..."
          />
          <p className="text-muted-foreground text-sm">
            Hook value: <strong>{uncontrolled ?? 'undefined'}</strong>
          </p>
          <p className="text-muted-foreground text-xs">Hook manages internal state independently</p>
        </div>
      </div>
    );
  },
};

/**
 * Number input example: Demonstrates using the hook with numeric values.
 */
export const WithNumbers: Story = {
  render: () => {
    const [controlledNumber, setControlledNumber] = useState<number | undefined>(42);
    const [number, setNumber] = useControlledState({
      value: controlledNumber,
      onChange: (newValue) => {
        setControlledNumber(newValue);
        action('number changed')(newValue);
      },
    });

    const [uncontrolledNumber, setUncontrolledNumber] = useControlledState<number>({
      defaultValue: 100,
    });

    return (
      <div className="flex w-80 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="controlled-number">Controlled Number</Label>
          <Input
            id="controlled-number"
            type="number"
            value={number ?? ''}
            onChange={(e) => setNumber(Number(e.target.value) || undefined)}
            placeholder="Enter a number..."
          />
          <p className="text-muted-foreground text-sm">
            Parent: <strong>{controlledNumber ?? 'undefined'}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="uncontrolled-number">Uncontrolled Number</Label>
          <Input
            id="uncontrolled-number"
            type="number"
            value={uncontrolledNumber ?? ''}
            onChange={(e) => {
              setUncontrolledNumber(Number(e.target.value) || undefined);
              action('uncontrolled number changed')(Number(e.target.value) || undefined);
            }}
            placeholder="Enter a number..."
          />
          <p className="text-muted-foreground text-sm">
            Hook: <strong>{uncontrolledNumber ?? 'undefined'}</strong>
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setControlledNumber(0)}>
            Reset Controlled
          </Button>
          <Button variant="outline" onClick={() => setUncontrolledNumber(0)}>
            Reset Uncontrolled
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Form integration: Shows how the hook works with form controls.
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
    });

    const [name, setName] = useControlledState({
      value: formData.name,
      onChange: (newValue) => {
        setFormData((prev) => ({ ...prev, name: newValue ?? '' }));
        action('name changed')(newValue);
      },
    });

    const [email, setEmail] = useControlledState({
      value: formData.email,
      onChange: (newValue) => {
        setFormData((prev) => ({ ...prev, email: newValue ?? '' }));
        action('email changed')(newValue);
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      action('form submitted')(formData);
      alert(`Form submitted:\nName: ${formData.name}\nEmail: ${formData.email}`);
    };

    return (
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="form-name">Name</Label>
          <Input
            id="form-name"
            value={name ?? ''}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="form-email">Email</Label>
          <Input
            id="form-email"
            type="email"
            value={email ?? ''}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="flex flex-col gap-2 rounded-md border p-3">
          <p className="font-medium text-sm">Form State:</p>
          <p className="text-muted-foreground text-xs">
            Name: <strong>{formData.name || '(empty)'}</strong>
          </p>
          <p className="text-muted-foreground text-xs">
            Email: <strong>{formData.email || '(empty)'}</strong>
          </p>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    );
  },
};
