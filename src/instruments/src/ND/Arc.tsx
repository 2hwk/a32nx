import React, { memo } from 'react';
import { MathUtils } from '@shared/MathUtils';

type ArcProps = {
    heading: number
}

export const Arc: React.FC<ArcProps> = memo(({ heading }) => {
    const headings = [];
    for (let i = 0; i < 36; i++) {
        headings.push(
            <g transform={`rotate(${(i * 10) - 60} 384 620)`}>
                <line x1={384} y1={128} x2={384} y2={99} strokeWidth={2.5} />
                <text x={384} y={91} textAnchor="middle" fontSize={(i % 3) ? 22 : 34} fill="white" stroke="none">{i}</text>
            </g>,
        );
    }

    return (
        <g transform={`rotate(${MathUtils.diffAngle(heading, 60)} 384 620)`}>
            {headings}
        </g>
    );
});
