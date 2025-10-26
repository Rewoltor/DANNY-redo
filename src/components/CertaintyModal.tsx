import * as React from 'react';

export default function CertaintyModal({
  onSelect,
  onClose,
}: {
  onSelect: (value: number) => void;
  onClose?: () => void;
}) {
  const [value, setValue] = React.useState<number | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Mennyire vagy biztos a döntésedben?</h3>
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
          <span>bizonytalan</span>
          <span>biztos</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map(v => (
            <button
              key={v}
              onClick={() => {
                setValue(v);
                onSelect(v);
              }}
              className={`px-3 py-2 rounded border ${
                value === v ? 'border-2 border-accent text-accent' : 'border-gray-200'
              } bg-gray-100`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
