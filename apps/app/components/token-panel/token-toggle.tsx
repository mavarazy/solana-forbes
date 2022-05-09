import { Switch } from '@headlessui/react';

interface TokenToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const TokenToggle = ({ enabled, onToggle }: TokenToggleProps) => (
  <>
    <Switch
      checked={enabled}
      onChange={onToggle}
      className="bg-white relative inline-flex h-6 w-11 items-center rounded-full border"
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-indigo-500 ease-in duration-150`}
      />
    </Switch>
  </>
);
