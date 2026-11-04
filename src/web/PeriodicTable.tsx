import type { CSSProperties, KeyboardEvent } from "react";
import { useRef } from "react";
import { familyClass, type ElementRecord } from "./elements";

interface Props {
  records: readonly ElementRecord[];
  selected: number;
  onSelect: (number: number) => void;
  compact?: boolean;
}

export function PeriodicTable({
  records,
  selected,
  onSelect,
  compact = false,
}: Props) {
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const focusable = records.some((e) => e.number === selected)
    ? selected
    : records[0]?.number;
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? records.length - 1
          : index + delta;
    if (!delta && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const target = records[(next + records.length) % records.length];
    onSelect(target.number);
    buttons.current.get(target.number)?.focus();
  }
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label={
        compact
          ? "Filtered elements"
          : "Periodic table, scroll horizontally on small screens"
      }
    >
      <div
        className={`periodic-table${compact ? " compact" : ""}`}
        aria-label="Elements"
      >
        {!compact && (
          <>
            {Array.from({ length: 18 }, (_, i) => (
              <span
                className="group-label"
                key={`g${i}`}
                style={{ gridColumn: i + 1, gridRow: 1 }}
              >
                {i + 1}
              </span>
            ))}
            <div className="table-note">
              <span>THE ELEMENTS</span>
              <strong>118 ways to begin.</strong>
              <p>
                Select an element to explore its identity.
                <br />
                Use arrow keys to move in atomic-number order.
              </p>
            </div>
            <span
              className="series-placeholder"
              style={{ gridRow: 7, gridColumn: 3 }}
            >
              57–71<span>La–Lu</span>
            </span>
            <span
              className="series-placeholder"
              style={{ gridRow: 8, gridColumn: 3 }}
            >
              89–103<span>Ac–Lr</span>
            </span>
          </>
        )}
        {records.map((e, i) => (
          <button
            key={e.number}
            type="button"
            tabIndex={e.number === focusable ? 0 : -1}
            ref={(node) => {
              if (node) buttons.current.set(e.number, node);
              else buttons.current.delete(e.number);
            }}
            className={`element ${familyClass(e.family)} ${selected === e.number ? "selected" : ""}`}
            style={
              compact
                ? undefined
                : ({
                    gridRow: e.row + 1,
                    gridColumn: e.column,
                  } as CSSProperties)
            }
            aria-label={`${e.number} ${e.symbol} ${e.name}`}
            aria-pressed={selected === e.number}
            onClick={() => onSelect(e.number)}
            onKeyDown={(event) => navigate(event, i)}
          >
            <span className="atomic-number">{e.number}</span>{" "}
            <strong>{e.symbol}</strong>{" "}
            <span className="element-name">{e.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
