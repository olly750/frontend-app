import '../../../styles/components/Atoms/custom/fireworks.css';

import React from 'react';

export default function Fireworks() {
  return (
    <div className="fireworks hidden" id="fireworksProvider">
      <div className="pyro">
        <div className="before"></div>
        <div className="after"></div>
      </div>
    </div>
  );
}

export interface Options {}

export function fire(period: number = 3000, useDark: boolean = true) {
  document
    .getElementById('fireworksProvider')
    ?.setAttribute('class', `fireworks ${useDark ? 'bg-black-transparent' : ''}`);
  setTimeout(() => {
    document
      .getElementById('fireworksProvider')
      ?.setAttribute('class', 'fireworks hidden');
  }, period || 2000);
}
