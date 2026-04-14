import { useState, useMemo } from 'react';

const SCENARIOS = [
  {
    label: 'Lean — 1 Loader',
    loaders: 1,
    utilization: 70,
    hoursPerShift: 8,
    shifts: 2,
  },
  {
    label: 'Standard — 2 Loaders',
    loaders: 2,
    utilization: 70,
    hoursPerShift: 8,
    shifts: 2,
  },
  {
    label: 'Aggressive — 3 Loaders',
    loaders: 3,
    utilization: 70,
    hoursPerShift: 10,
    shifts: 2,
  },
];

const ACCENT_COLORS = [
  '#3498db',
  '#2ecc71',
  '#e67e22',
  '#9b59b6',
  '#e74c3c',
  '#1abc9c',
];

function calendarDays(start, end) {
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function parseDate(str) {
  const d = new Date(str);
  return isNaN(d) ? null : d;
}

function displayDate(d) {
  if (!d) return '—';
  return d.toDateString().slice(4);
}

function Gauge({ value, max, color, label }) {
  const pct = Math.min(Math.max(value, 0) / Math.max(max, 1), 1);
  const r = 38,
    cx = 50,
    cy = 50;
  const circumference = Math.PI * r;
  const dash = pct * circumference;
  const display =
    typeof value === 'number'
      ? Number.isInteger(value)
        ? value.toLocaleString()
        : value.toFixed(1)
      : value;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 100 60" style={{ width: 100 }}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#1e2a38"
          strokeWidth="8"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
        <text
          x="50"
          y="47"
          textAnchor="middle"
          fill="#f0f4f8"
          style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}
        >
          {display}
        </text>
      </svg>
      <div
        style={{
          fontSize: 9,
          color: '#7a9bb5',
          marginTop: -4,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SliderRow({ label, min, max, step, value, onChange, format, accent }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 3,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: '#7a9bb5',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            color: accent || '#f0a500',
            fontWeight: 700,
            fontFamily: 'monospace',
          }}
        >
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: accent || '#f0a500',
          cursor: 'pointer',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 1,
        }}
      >
        <span style={{ fontSize: 9, color: '#2a4a60' }}>
          {format ? format(min) : min}
        </span>
        <span style={{ fontSize: 9, color: '#2a4a60' }}>
          {format ? format(max) : max}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ ok, label }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 1,
        background: ok ? '#0d3320' : '#3a0d0d',
        color: ok ? '#2ecc71' : '#e74c3c',
        border: `1px solid ${ok ? '#2ecc71' : '#e74c3c'}`,
      }}
    >
      {label}
    </span>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 9,
          color: '#4a7a9b',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: '#060e18',
          border: '1px solid #1a4060',
          color: '#f0f4f8',
          padding: '5px 8px',
          borderRadius: 6,
          fontSize: 12,
          fontFamily: 'monospace',
          outline: 'none',
        }}
      />
    </div>
  );
}

function CategoryRow({ cat, index, onChange, onRemove, color }) {
  const carsRequired =
    cat.pipesPerCar > 0
      ? Math.ceil((cat.totalPipes || 0) / cat.pipesPerCar)
      : 0;
  return (
    <div
      style={{
        background: '#060e18',
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: '10px 12px',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: color,
            }}
          />
          <span style={{ fontSize: 10, color: '#c0d8f0', fontWeight: 700 }}>
            Category {index + 1}
          </span>
        </div>
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: '1px solid #3a1a1a',
            color: '#e74c3c',
            fontSize: 9,
            padding: '2px 7px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <InputField
          label='Diameter (")'
          value={cat.diameter}
          onChange={(v) => onChange({ ...cat, diameter: v })}
          placeholder="e.g. 20"
        />
        <InputField
          label='Thickness (")'
          value={cat.thickness}
          onChange={(v) => onChange({ ...cat, thickness: v })}
          placeholder="e.g. 0.312"
        />
        <InputField
          label="Total Pipes"
          type="number"
          value={cat.totalPipes}
          onChange={(v) => onChange({ ...cat, totalPipes: Number(v) })}
          placeholder="3862"
        />
        <InputField
          label="Pipes / Car"
          type="number"
          value={cat.pipesPerCar}
          onChange={(v) => onChange({ ...cat, pipesPerCar: Number(v) })}
          placeholder="35"
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 6,
          padding: '5px 8px',
          background: '#0a1520',
          borderRadius: 5,
        }}
      >
        <span style={{ fontSize: 9, color: '#4a7a9b' }}>
          Rail cars required:
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color,
            fontFamily: 'monospace',
          }}
        >
          {carsRequired} cars
        </span>
      </div>
    </div>
  );
}

function ScenarioCard({
  s,
  minPerPipe,
  totalPipes,
  totalCars,
  startDate,
  deadline,
}) {
  const effectiveHoursPerDay =
    s.loaders * s.hoursPerShift * s.shifts * (s.utilization / 100);
  const pipesPerDay = Math.max(
    Math.floor((effectiveHoursPerDay * 60) / minPerPipe),
    1
  );
  const totalDays = Math.ceil(totalPipes / pipesPerDay);
  const finishDate = new Date(startDate);
  finishDate.setDate(finishDate.getDate() + totalDays);
  const deadlineOk = deadline ? finishDate <= deadline : true;

  return (
    <div
      style={{
        background: '#0d1b2a',
        border: `1px solid ${deadlineOk ? '#1a4a2e' : '#4a1a1a'}`,
        borderRadius: 10,
        padding: '11px 13px',
        flex: '1 1 170px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: '#c0d8f0' }}>
          {s.label}
        </div>
        <StatusBadge ok={deadlineOk} label={deadlineOk ? 'ON TIME' : 'LATE'} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {[
          ['Loaders', s.loaders],
          ['Util', `${s.utilization}%`],
          ['Shifts', s.shifts],
          ['Hrs/Shift', s.hoursPerShift],
          ['Pipes/Day', pipesPerDay.toLocaleString()],
          ['Work Days', totalDays],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              background: '#0a1520',
              borderRadius: 4,
              padding: '3px 6px',
            }}
          >
            <div
              style={{
                color: '#4a7a9b',
                fontSize: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {k}
            </div>
            <div
              style={{
                color: '#f0f4f8',
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: 11,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 7,
          background: '#0a1520',
          borderRadius: 4,
          padding: '4px 6px',
        }}
      >
        <div
          style={{
            fontSize: 8,
            color: '#4a7a9b',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Est. Finish
        </div>
        <div
          style={{
            color: deadlineOk ? '#2ecc71' : '#e74c3c',
            fontWeight: 700,
            fontFamily: 'monospace',
            fontSize: 11,
          }}
        >
          {displayDate(finishDate)}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CATS = [
  {
    id: 1,
    diameter: '20',
    thickness: '0.312',
    totalPipes: 3862,
    pipesPerCar: 35,
  },
  {
    id: 2,
    diameter: '20',
    thickness: '0.444',
    totalPipes: 816,
    pipesPerCar: 29,
  },
];

export default function LoadoutPlanner() {
  const [categories, setCategories] = useState(DEFAULT_CATS);
  const [loaders, setLoaders] = useState(2);
  const [utilization, setUtilization] = useState(70);
  const [hoursPerShift, setHoursPerShift] = useState(8);
  const [shifts, setShifts] = useState(2);
  const [minPerPipe, setMinPerPipe] = useState(4);
  const [startDateStr, setStartDateStr] = useState('2025-04-13');
  const [deadlineDateStr, setDeadlineDateStr] = useState('2025-05-08');
  const [activeTab, setActiveTab] = useState('project');

  const startDate = parseDate(startDateStr) || new Date();
  const deadline = parseDate(deadlineDateStr);

  const totalPipes = categories.reduce(
    (s, c) => s + (Number(c.totalPipes) || 0),
    0
  );
  const totalCars = categories.reduce(
    (s, c) =>
      s +
      (c.pipesPerCar > 0 ? Math.ceil((c.totalPipes || 0) / c.pipesPerCar) : 0),
    0
  );
  const deadlineDays = deadline ? calendarDays(new Date(), deadline) : null;

  const effectiveHoursPerDay =
    loaders * hoursPerShift * shifts * (utilization / 100);
  const pipesPerDay = Math.max(
    Math.floor((effectiveHoursPerDay * 60) / minPerPipe),
    1
  );
  const totalWorkDays = Math.ceil(totalPipes / pipesPerDay);
  const finishDate = new Date(startDate);
  finishDate.setDate(finishDate.getDate() + totalWorkDays);
  const deadlineOk = deadline ? finishDate <= deadline : true;
  const bufferDays = deadline ? calendarDays(finishDate, deadline) : null;

  const dailyProgress = useMemo(() => {
    const arr = [];
    for (let d = 1; d <= Math.min(totalWorkDays, 50); d++) {
      arr.push({ day: d, loaded: Math.min(d * pipesPerDay, totalPipes) });
    }
    return arr;
  }, [pipesPerDay, totalWorkDays, totalPipes]);

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        diameter: '',
        thickness: '',
        totalPipes: 0,
        pipesPerCar: 0,
      },
    ]);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#060e18',
        fontFamily: "'Courier New', monospace",
        color: '#c0d8f0',
        padding: '18px 14px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '2px 12px',
            border: '1px solid #1a4060',
            borderRadius: 20,
            fontSize: 9,
            color: '#4a9bb5',
            letterSpacing: 2,
            marginBottom: 5,
          }}
        >
          WELSPUN TUBULAR — YARD OPS
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 19,
            fontWeight: 900,
            color: '#f0f4f8',
            letterSpacing: 1,
          }}
        >
          RAIL CAR LOADOUT PLANNER
        </h1>
        {deadlineDays !== null && (
          <div style={{ fontSize: 10, color: '#4a7a9b', marginTop: 3 }}>
            Deadline:{' '}
            <span style={{ color: '#f0a500', fontWeight: 700 }}>
              {displayDate(deadline)}
            </span>
            &nbsp;·&nbsp;{deadlineDays} calendar days from today
          </div>
        )}
      </div>

      {/* Summary Strip */}
      <div
        style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}
      >
        {[
          {
            label: 'Total Pipes',
            val: totalPipes.toLocaleString(),
            color: '#3498db',
          },
          { label: 'Total Rail Cars', val: totalCars, color: '#2ecc71' },
          { label: 'Categories', val: categories.length, color: '#e67e22' },
          {
            label: 'Work Days Needed',
            val: totalWorkDays,
            color: deadlineOk ? '#2ecc71' : '#e74c3c',
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              flex: '1 1 90px',
              background: '#0a1520',
              border: `1px solid ${c.color}28`,
              borderRadius: 8,
              padding: '7px 10px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: '#4a7a9b',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: c.color,
                fontFamily: 'monospace',
              }}
            >
              {c.val}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {/* LEFT PANEL */}
        <div
          style={{
            flex: '0 0 272px',
            background: '#0a1520',
            border: '1px solid #1a3050',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1a3050' }}>
            {['project', 'operations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '9px 4px',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  background: activeTab === tab ? '#0d2a40' : 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${
                    activeTab === tab ? '#f0a500' : 'transparent'
                  }`,
                  color: activeTab === tab ? '#f0a500' : '#4a7a9b',
                }}
              >
                {tab === 'project' ? '📋 Project Setup' : '⚙ Operations'}
              </button>
            ))}
          </div>

          <div style={{ padding: '14px 16px' }}>
            {activeTab === 'project' && (
              <>
                {/* Dates */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: '#f0a500',
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      marginBottom: 8,
                      fontWeight: 700,
                    }}
                  >
                    📅 DATE RANGE
                  </div>
                  <InputField
                    label="Start Date"
                    type="date"
                    value={startDateStr}
                    onChange={setStartDateStr}
                  />
                  <InputField
                    label="Deadline / End Date"
                    type="date"
                    value={deadlineDateStr}
                    onChange={setDeadlineDateStr}
                  />
                </div>

                <div style={{ borderTop: '1px solid #1a3050', paddingTop: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: '#f0a500',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        fontWeight: 700,
                      }}
                    >
                      🔩 PIPE CATEGORIES
                    </div>
                    <button
                      onClick={addCategory}
                      style={{
                        background: '#0d2a40',
                        border: '1px solid #1a6080',
                        color: '#3ab5d5',
                        fontSize: 9,
                        padding: '3px 9px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        letterSpacing: 1,
                      }}
                    >
                      + ADD
                    </button>
                  </div>

                  {categories.map((cat, i) => (
                    <CategoryRow
                      key={cat.id}
                      cat={cat}
                      index={i}
                      color={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                      onChange={(updated) =>
                        setCategories((prev) =>
                          prev.map((c) =>
                            c.id === cat.id ? { ...updated, id: cat.id } : c
                          )
                        )
                      }
                      onRemove={() =>
                        setCategories((prev) =>
                          prev.filter((c) => c.id !== cat.id)
                        )
                      }
                    />
                  ))}

                  {categories.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#2a4a60',
                        fontSize: 11,
                        padding: '16px 0',
                      }}
                    >
                      No categories — click + ADD
                    </div>
                  )}

                  {/* Summary table */}
                  {categories.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: 10,
                        }}
                      >
                        <thead>
                          <tr>
                            {['Dimension', 'Pipes', 'Cars'].map((h) => (
                              <th
                                key={h}
                                style={{
                                  color: '#4a7a9b',
                                  textAlign: 'left',
                                  padding: '3px 4px',
                                  borderBottom: '1px solid #1a3050',
                                  fontSize: 8,
                                  letterSpacing: 1,
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat, i) => {
                            const cars =
                              cat.pipesPerCar > 0
                                ? Math.ceil(
                                    (cat.totalPipes || 0) / cat.pipesPerCar
                                  )
                                : 0;
                            const color =
                              ACCENT_COLORS[i % ACCENT_COLORS.length];
                            const lbl =
                              cat.diameter && cat.thickness
                                ? `${cat.diameter}"×${cat.thickness}"`
                                : `Cat ${i + 1}`;
                            return (
                              <tr key={cat.id}>
                                <td style={{ padding: '3px 4px', color }}>
                                  {lbl}
                                </td>
                                <td
                                  style={{
                                    padding: '3px 4px',
                                    color: '#f0f4f8',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {(cat.totalPipes || 0).toLocaleString()}
                                </td>
                                <td
                                  style={{
                                    padding: '3px 4px',
                                    color: '#f0f4f8',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {cars}
                                </td>
                              </tr>
                            );
                          })}
                          <tr style={{ borderTop: '1px solid #1a3050' }}>
                            <td
                              style={{
                                padding: '4px 4px',
                                color: '#f0a500',
                                fontWeight: 700,
                              }}
                            >
                              TOTAL
                            </td>
                            <td
                              style={{
                                padding: '4px 4px',
                                color: '#f0a500',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                              }}
                            >
                              {totalPipes.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: '4px 4px',
                                color: '#f0a500',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                              }}
                            >
                              {totalCars}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'operations' && (
              <>
                <div
                  style={{
                    fontSize: 9,
                    color: '#f0a500',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginBottom: 12,
                    fontWeight: 700,
                  }}
                >
                  ⚙ OPERATIONAL PARAMETERS
                </div>
                <SliderRow
                  label="Min / Pipe"
                  min={2}
                  max={8}
                  step={0.5}
                  value={minPerPipe}
                  onChange={setMinPerPipe}
                  format={(v) => `${v} min`}
                  accent="#e74c3c"
                />
                <SliderRow
                  label="Loaders"
                  min={1}
                  max={6}
                  step={1}
                  value={loaders}
                  onChange={setLoaders}
                  format={(v) => `${v} loader${v > 1 ? 's' : ''}`}
                  accent="#3498db"
                />
                <SliderRow
                  label="Utilization"
                  min={50}
                  max={100}
                  step={5}
                  value={utilization}
                  onChange={setUtilization}
                  format={(v) => `${v}%`}
                  accent="#9b59b6"
                />
                <SliderRow
                  label="Shifts / Day"
                  min={1}
                  max={3}
                  step={1}
                  value={shifts}
                  onChange={setShifts}
                  format={(v) => `${v} shift${v > 1 ? 's' : ''}`}
                  accent="#2ecc71"
                />
                <SliderRow
                  label="Hours / Shift"
                  min={6}
                  max={12}
                  step={1}
                  value={hoursPerShift}
                  onChange={setHoursPerShift}
                  format={(v) => `${v} hrs`}
                  accent="#f0a500"
                />

                <div
                  style={{
                    borderTop: '1px solid #1a3050',
                    marginTop: 6,
                    paddingTop: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#4a7a9b',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginBottom: 7,
                    }}
                  >
                    Quick Presets
                  </div>
                  {[
                    {
                      label: 'Regular Op — 5 min/pipe',
                      fn: () => setMinPerPipe(5),
                    },
                    {
                      label: 'Good Op — 3 min/pipe',
                      fn: () => setMinPerPipe(3),
                    },
                    {
                      label: 'Set 70% Utilization',
                      fn: () => setUtilization(70),
                    },
                    {
                      label: 'Max Effort Push',
                      fn: () => {
                        setLoaders(3);
                        setShifts(3);
                        setHoursPerShift(10);
                        setUtilization(85);
                      },
                    },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={p.fn}
                      style={{
                        display: 'block',
                        width: '100%',
                        marginBottom: 5,
                        background: '#0d1b2a',
                        border: '1px solid #1a4060',
                        color: '#7ab5d5',
                        fontSize: 10,
                        padding: '5px 9px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        textAlign: 'left',
                        letterSpacing: 0.5,
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, minWidth: 240 }}>
          {/* Live Result */}
          <div
            style={{
              background: '#0a1520',
              border: `2px solid ${deadlineOk ? '#1a5a30' : '#5a1a1a'}`,
              borderRadius: 12,
              padding: '13px 16px',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: '#f0a500',
                  letterSpacing: 2,
                  fontWeight: 700,
                }}
              >
                ▶ LIVE RESULT
              </div>
              <StatusBadge
                ok={deadlineOk}
                label={
                  deadline
                    ? deadlineOk
                      ? `✓ ON TIME — ${bufferDays}d BUFFER`
                      : `✗ LATE BY ${Math.abs(bufferDays)}d`
                    : 'NO DEADLINE SET'
                }
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              <Gauge
                value={pipesPerDay}
                max={Math.max(pipesPerDay * 1.5, 200)}
                color="#3498db"
                label="Pipes/Day"
              />
              <Gauge
                value={totalWorkDays}
                max={Math.max(totalWorkDays * 1.5, 30)}
                color={deadlineOk ? '#2ecc71' : '#e74c3c'}
                label="Work Days"
              />
              <Gauge
                value={parseFloat(effectiveHoursPerDay.toFixed(1))}
                max={30}
                color="#f0a500"
                label="Eff Hrs/Day"
              />
              <Gauge
                value={parseFloat(
                  (totalCars / Math.max(totalWorkDays, 1)).toFixed(1)
                )}
                max={10}
                color="#9b59b6"
                label="Cars/Day"
              />
            </div>
            <div
              style={{
                marginTop: 10,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 5,
              }}
            >
              {[
                ['Start', displayDate(startDate)],
                ['Est. Finish', displayDate(finishDate)],
                ['Deadline', deadline ? displayDate(deadline) : 'Not set'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: '#060e18',
                    borderRadius: 5,
                    padding: '5px 8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      color: '#4a7a9b',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#f0f4f8',
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          {categories.length > 0 && (
            <div
              style={{
                background: '#0a1520',
                border: '1px solid #1a3050',
                borderRadius: 12,
                padding: '11px 14px',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: '#f0a500',
                  letterSpacing: 2,
                  fontWeight: 700,
                  marginBottom: 9,
                }}
              >
                🔩 PIPE CATEGORY BREAKDOWN
              </div>
              {categories.map((cat, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                const cars =
                  cat.pipesPerCar > 0
                    ? Math.ceil((cat.totalPipes || 0) / cat.pipesPerCar)
                    : 0;
                const pct =
                  totalPipes > 0
                    ? ((cat.totalPipes || 0) / totalPipes) * 100
                    : 0;
                const label =
                  cat.diameter && cat.thickness
                    ? `${cat.diameter}" × ${cat.thickness}"`
                    : `Category ${i + 1}`;
                return (
                  <div key={cat.id} style={{ marginBottom: 9 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color }}>{label}</span>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#c0d8f0',
                          fontFamily: 'monospace',
                        }}
                      >
                        {(cat.totalPipes || 0).toLocaleString()} pipes · {cars}{' '}
                        cars
                      </span>
                    </div>
                    <div
                      style={{
                        height: 7,
                        background: '#060e18',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: color,
                          borderRadius: 4,
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <div
                      style={{ fontSize: 8, color: '#3a5a70', marginTop: 1 }}
                    >
                      {pct.toFixed(1)}% of total · {cat.pipesPerCar || '—'}{' '}
                      pipes/car
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progress Chart */}
          <div
            style={{
              background: '#0a1520',
              border: '1px solid #1a3050',
              borderRadius: 12,
              padding: '11px 14px',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: '#f0a500',
                letterSpacing: 2,
                fontWeight: 700,
                marginBottom: 9,
              }}
            >
              📊 CUMULATIVE LOADING PROGRESS
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                height: 65,
                gap: 1,
              }}
            >
              {dailyProgress.slice(0, 45).map((d, i) => {
                const h = totalPipes > 0 ? (d.loaded / totalPipes) * 65 : 0;
                const done = d.loaded >= totalPipes;
                return (
                  <div
                    key={i}
                    title={`Day ${d.day}: ${d.loaded.toLocaleString()} pipes`}
                    style={{
                      flex: 1,
                      height: Math.max(h, 2),
                      background: done
                        ? '#2ecc71'
                        : `hsl(${200 + i * 3}, 68%, ${
                            27 + (d.loaded / totalPipes) * 28
                          }%)`,
                      borderRadius: '2px 2px 0 0',
                      minWidth: 2,
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 3,
              }}
            >
              <span style={{ fontSize: 8, color: '#2a4a60' }}>Day 1</span>
              <span style={{ fontSize: 8, color: '#2a4a60' }}>
                Day {Math.min(totalWorkDays, 45)}
              </span>
            </div>
            <div
              style={{
                fontSize: 8,
                color: '#4a7a9b',
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              {(totalCars / Math.max(totalWorkDays, 1)).toFixed(1)} cars/day avg
              &nbsp;·&nbsp;
              {pipesPerDay.toLocaleString()} pipes/day &nbsp;·&nbsp;
              {totalWorkDays} working days
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            fontSize: 9,
            color: '#f0a500',
            letterSpacing: 2,
            fontWeight: 700,
            marginBottom: 9,
          }}
        >
          ⚡ SCENARIO COMPARISON — {totalPipes.toLocaleString()} pipes at{' '}
          {minPerPipe} min/pipe
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          {SCENARIOS.map((s) => (
            <ScenarioCard
              key={s.label}
              s={s}
              minPerPipe={minPerPipe}
              totalPipes={totalPipes}
              totalCars={totalCars}
              startDate={startDate}
              deadline={deadline}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 16,
          fontSize: 8,
          color: '#1a3a50',
          letterSpacing: 1,
        }}
      >
        WELSPUN TUBULAR · YARD OPERATIONS · LOADOUT SIMULATION v2.0
      </div>
    </div>
  );
}
