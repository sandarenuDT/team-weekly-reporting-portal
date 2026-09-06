'use client';

interface Item {
  description: string;
  [flagKey: string]: any;
}

interface Props<T extends Item> {
  items: T[];
  flagKey: string;
  flagLabel: string;
  placeholder: string;
  onChange: (items: T[]) => void;
}

export function FlaggableList<T extends Item>({
  items,
  flagKey,
  flagLabel,
  placeholder,
  onChange,
}: Props<T>) {
  function updateDescription(index: number, value: string) {
    const next = [...items];
    next[index] = { ...next[index], description: value };
    onChange(next);
  }

  function setFlag(index: number) {
    // Only one item can be flagged as the key issue/achievement.
    const next = items.map((item, i) => ({ ...item, [flagKey]: i === index }));
    onChange(next as T[]);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...items, { description: '', [flagKey]: false } as T]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            type="radio"
            name={flagKey}
            checked={!!item[flagKey]}
            onChange={() => setFlag(i)}
            className="mt-2.5"
            title={flagLabel}
          />
          <textarea
            value={item.description}
            onChange={(e) => updateDescription(i, e.target.value)}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
            rows={2}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-gray-400 hover:text-red-600 mt-2"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-gray-600 hover:text-gray-900 underline">
        + Add
      </button>
      {items.length > 0 && (
        <p className="text-xs text-gray-400">Select the radio next to the {flagLabel.toLowerCase()}.</p>
      )}
    </div>
  );
}