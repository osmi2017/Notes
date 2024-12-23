import React from 'react';

export function Logo() {
  return (
    <div className="flex gap-2 items-start self-start text-3xl font-bold leading-none whitespace-nowrap tracking-[2.8px]">
      <div className="text-white">Notes App</div>
      <div className="text-sky-500">.</div>
    </div>
  );
}