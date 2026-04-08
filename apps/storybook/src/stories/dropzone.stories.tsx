import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@masan-group/shared-ui/dropzone';

/**
 * A drag-and-drop file upload component with customizable accept types,
 * file size limits, and multiple file support.
 */
const meta: Meta<typeof Dropzone> = {
  title: 'ui/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  argTypes: {
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files that can be uploaded',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    minSize: {
      control: 'number',
      description: 'Minimum file size in bytes',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropzone',
    },
    accept: {
      control: 'object',
      description: 'Accepted file types (MIME types)',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    maxFiles: 1,
    disabled: false,
  },
} satisfies Meta<typeof Dropzone>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the dropzone for single file upload.
 */
export const Default: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone that accepts only image files.
 */
export const ImagesOnly: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          }}
          maxSize={5 * 1024 * 1024} // 5MB
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone that accepts CSV and Excel files.
 */
export const SpreadsheetFiles: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          accept={{
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
          }}
          maxSize={10 * 1024 * 1024} // 10MB
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone that accepts multiple files.
 */
export const MultipleFiles: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          maxFiles={5}
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone with file size constraints.
 */
export const WithSizeConstraints: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          minSize={1024} // 1KB minimum
          maxSize={2 * 1024 * 1024} // 2MB maximum
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A disabled dropzone that prevents file uploads.
 */
export const Disabled: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          disabled
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone with custom empty state content.
 */
export const CustomEmptyState: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 font-medium text-sm">📄 Drop your documents here</p>
              <p className="text-muted-foreground text-xs">or click to browse</p>
            </div>
          </DropzoneEmptyState>
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone with custom content display after file selection.
 */
export const CustomContent: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent>
            {files && files.length > 0 && (
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 font-medium text-sm">✅ {files.length} file(s) selected</p>
                <p className="text-muted-foreground text-xs">
                  {files.map((f) => f.name).join(', ')}
                </p>
              </div>
            )}
          </DropzoneContent>
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone for PDF documents only.
 */
export const PDFOnly: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();

    return (
      <div className="w-[400px]">
        <Dropzone
          {...args}
          src={files}
          accept={{
            'application/pdf': ['.pdf'],
          }}
          maxSize={20 * 1024 * 1024} // 20MB
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

/**
 * A dropzone with error handling.
 */
export const WithErrorHandling: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>();
    const [error, setError] = useState<string>();

    return (
      <div className="w-[400px] space-y-2">
        <Dropzone
          {...args}
          src={files}
          maxSize={1024 * 1024} // 1MB
          onDrop={(acceptedFiles) => {
            setFiles(acceptedFiles);
            setError(undefined);
          }}
          onError={(err) => {
            setError(err.message);
          }}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        {error && <p className="text-center text-destructive text-sm">{error}</p>}
      </div>
    );
  },
};
