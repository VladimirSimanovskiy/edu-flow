import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { cn } from '../../utils/cn';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface SelectProps<T extends string | number> {
  value?: T;
  onChange?: (value: T) => void;
  options: Array<SelectOption<T>>;
  placeholder?: string;
}

export const Select = <T extends string | number>({ value, onChange, options, placeholder }: SelectProps<T>) => {
  return (
    <RadixSelect.Root value={value !== undefined ? String(value) : undefined} onValueChange={(v) => onChange?.((typeof options[0]?.value === 'number' ? Number(v) : v) as T)}>
      <RadixSelect.Trigger
        className={cn(
          'inline-flex w-full items-center justify-between rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-400'
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="z-[1050] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
          <RadixSelect.ScrollUpButton className="flex items-center justify-center p-1 text-gray-500">
            <ChevronUp className="h-4 w-4" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item
                key={String(opt.value)}
                value={String(opt.value)}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded px-2 py-1 text-sm text-gray-900 outline-none',
                  'data-[highlighted]:bg-gray-100'
                )}
              >
                <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4 text-accent-500" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex items-center justify-center p-1 text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};
