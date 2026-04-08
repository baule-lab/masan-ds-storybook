import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';

import { Button } from '@masan-group/shared-ui/button';
import { defineStepper } from '@masan-group/shared-ui/stepper';

const { useStepper, Stepper } = defineStepper(
  { id: 'step-1', title: 'Account', description: 'Create your account' },
  { id: 'step-2', title: 'Profile', description: 'Set up your profile' },
  { id: 'step-3', title: 'Preferences', description: 'Configure preferences' },
  { id: 'step-4', title: 'Review', description: 'Review and confirm' }
);

/**
 * A multi-step navigation component that guides users through a process.
 */
const meta: Meta = {
  title: 'ui/Stepper',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Horizontal stepper with default styling.
 */
export const Horizontal: Story = {
  render: () => (
    <Stepper.Provider variant="horizontal">
      <Stepper.Navigation>
        <Stepper.Step of="step-1">
          <Stepper.Title>Account</Stepper.Title>
          <Stepper.Description>Create your account</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Title>Profile</Stepper.Title>
          <Stepper.Description>Set up your profile</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Title>Preferences</Stepper.Title>
          <Stepper.Description>Configure preferences</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Title>Review</Stepper.Title>
          <Stepper.Description>Review and confirm</Stepper.Description>
        </Stepper.Step>
      </Stepper.Navigation>
      <div className="mt-8">
        <Stepper.Step of="step-1">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Enter your email and create a password to get started.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Profile Setup</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Tell us about yourself and upload a profile picture.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Preferences</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Customize your experience with notification and display settings.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Review & Confirm</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Review your information and confirm to complete setup.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
      </div>
      <StepperControls />
    </Stepper.Provider>
  ),
};

/**
 * Vertical stepper layout for step-by-step processes.
 */
export const Vertical: Story = {
  render: () => (
    <Stepper.Provider variant="vertical">
      <Stepper.Navigation>
        <Stepper.Step of="step-1">
          <Stepper.Title>Account</Stepper.Title>
          <Stepper.Description>Create your account</Stepper.Description>
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Enter your email and create a password to get started.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Title>Profile</Stepper.Title>
          <Stepper.Description>Set up your profile</Stepper.Description>
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Profile Setup</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Tell us about yourself and upload a profile picture.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Title>Preferences</Stepper.Title>
          <Stepper.Description>Configure preferences</Stepper.Description>
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Preferences</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Customize your experience with notification and display settings.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Title>Review</Stepper.Title>
          <Stepper.Description>Review and confirm</Stepper.Description>
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Review & Confirm</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Review your information and confirm to complete setup.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
      </Stepper.Navigation>
      <StepperControls />
    </Stepper.Provider>
  ),
};

/**
 * Circle progress indicator showing overall completion.
 */
export const CircleProgress: Story = {
  render: () => (
    <Stepper.Provider variant="circle">
      <Stepper.Navigation>
        <Stepper.Step of="step-1">
          <Stepper.Title>Account</Stepper.Title>
          <Stepper.Description>Create your account</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Title>Profile</Stepper.Title>
          <Stepper.Description>Set up your profile</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Title>Preferences</Stepper.Title>
          <Stepper.Description>Configure preferences</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Title>Review</Stepper.Title>
          <Stepper.Description>Review and confirm</Stepper.Description>
        </Stepper.Step>
      </Stepper.Navigation>
      <div className="mt-8">
        <Stepper.Step of="step-1">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Enter your email and create a password to get started.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Profile Setup</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Tell us about yourself and upload a profile picture.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Preferences</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Customize your experience with notification and display settings.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Review & Confirm</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Review your information and confirm to complete setup.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
      </div>
      <StepperControls />
    </Stepper.Provider>
  ),
};

/**
 * Horizontal stepper with vertical label orientation.
 */
export const HorizontalVerticalLabels: Story = {
  render: () => (
    <Stepper.Provider variant="horizontal" labelOrientation="vertical">
      <Stepper.Navigation>
        <Stepper.Step of="step-1">
          <Stepper.Title>Account</Stepper.Title>
          <Stepper.Description>Create account</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Title>Profile</Stepper.Title>
          <Stepper.Description>Setup profile</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Title>Preferences</Stepper.Title>
          <Stepper.Description>Configure settings</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Title>Review</Stepper.Title>
          <Stepper.Description>Confirm details</Stepper.Description>
        </Stepper.Step>
      </Stepper.Navigation>
      <div className="mt-8">
        <Stepper.Step of="step-1">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Enter your email and create a password to get started.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Profile Setup</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Tell us about yourself and upload a profile picture.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Preferences</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Customize your experience with notification and display settings.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Review & Confirm</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Review your information and confirm to complete setup.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
      </div>
      <StepperControls />
    </Stepper.Provider>
  ),
};

/**
 * Stepper with custom icons for each step.
 */
export const WithCustomIcons: Story = {
  render: () => (
    <Stepper.Provider variant="horizontal">
      <Stepper.Navigation>
        <Stepper.Step of="step-1" icon={<User className="h-4 w-4" />}>
          <Stepper.Title>Account</Stepper.Title>
          <Stepper.Description>Create your account</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Title>Profile</Stepper.Title>
          <Stepper.Description>Set up your profile</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Title>Preferences</Stepper.Title>
          <Stepper.Description>Configure preferences</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Title>Review</Stepper.Title>
          <Stepper.Description>Review and confirm</Stepper.Description>
        </Stepper.Step>
      </Stepper.Navigation>
      <div className="mt-8">
        <Stepper.Step of="step-1">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Enter your email and create a password to get started.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Profile Setup</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Tell us about yourself and upload a profile picture.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Preferences</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Customize your experience with notification and display settings.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Review & Confirm</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Review your information and confirm to complete setup.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
      </div>
      <StepperControls />
    </Stepper.Provider>
  ),
};

/**
 * Stepper with tracking enabled to auto-scroll to active step.
 */
export const WithTracking: Story = {
  render: () => (
    <Stepper.Provider variant="horizontal" tracking={true}>
      <Stepper.Navigation>
        <Stepper.Step of="step-1">
          <Stepper.Title>Account</Stepper.Title>
          <Stepper.Description>Create your account</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Title>Profile</Stepper.Title>
          <Stepper.Description>Set up your profile</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Title>Preferences</Stepper.Title>
          <Stepper.Description>Configure preferences</Stepper.Description>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Title>Review</Stepper.Title>
          <Stepper.Description>Review and confirm</Stepper.Description>
        </Stepper.Step>
      </Stepper.Navigation>
      <div className="mt-8">
        <Stepper.Step of="step-1">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Enter your email and create a password to get started.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-2">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Profile Setup</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Tell us about yourself and upload a profile picture.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-3">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Preferences</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Customize your experience with notification and display settings.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
        <Stepper.Step of="step-4">
          <Stepper.Panel>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-lg">Review & Confirm</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Review your information and confirm to complete setup.
              </p>
            </div>
          </Stepper.Panel>
        </Stepper.Step>
      </div>
      <StepperControls />
    </Stepper.Provider>
  ),
};

// Helper component for navigation controls
function StepperControls() {
  const { next, prev, isLast } = useStepper();

  return (
    <Stepper.Controls className="mt-8">
      <Button variant="outline" onClick={prev} disabled={!prev}>
        Previous
      </Button>
      <Button onClick={next} disabled={isLast}>
        {isLast ? 'Complete' : 'Next'}
      </Button>
    </Stepper.Controls>
  );
}
