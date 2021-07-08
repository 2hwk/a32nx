import React, { memo, useEffect, useState } from 'react';
import { useSimVar } from '@instruments/common/simVars';
import { MathUtils } from '@shared/MathUtils';
import { useFlightPlanManager } from '@instruments/common/flightplan';
import { LatLongData } from '@typings/fs-base-ui/html_ui/JS/Types';
import { FlightPlan } from '../FlightPlan';
import { MapParameters } from '../utils/MapParameters';
import { RadioNeedle } from '../RadioNeedles';
import { Arc } from '../Arc';
import { Plane } from '../Plane';
import { ToWaypointIndicator } from '../ToWaypointIndicator';
import { rangeSettings } from '../index';
import { ApproachMessage } from '../ApproachMessage';

export type ArcModeProps = {
    side: 'L' | 'R',
    ppos: LatLongData,
}

export const ArcMode: React.FC<ArcModeProps> = ({ side, ppos }) => {
    const flightPlanManager = useFlightPlanManager();

    const [magHeading] = useSimVar('PLANE HEADING DEGREES MAGNETIC', 'degrees');
    const [trueHeading] = useSimVar('PLANE HEADING DEGREES TRUE', 'degrees');
    const [rangeIndex] = useSimVar(side === 'L' ? 'L:A32NX_EFIS_L_ND_RANGE' : 'L:A32NX_EFIS_R_ND_RANGE', 'number', 100);
    const [tcasMode] = useSimVar('L:A32NX_SWITCH_TCAS_Position', 'number');
    const [fmgcFlightPhase] = useSimVar('L:A32NX_FMGC_FLIGHT_PHASE', 'enum');

    const [mapParams] = useState(() => {
        const params = new MapParameters();
        params.compute(ppos, rangeSettings[rangeIndex] * 2, 768, trueHeading);

        return params;
    });

    useEffect(() => {
        mapParams.compute(ppos, rangeSettings[rangeIndex] * 2, 768, trueHeading);
    }, [ppos.lat, ppos.long, magHeading, rangeIndex].map((n) => MathUtils.fastToFixed(n, 6)));

    return (
        <>
            <FlightPlan
                y={236}
                flightPlanManager={flightPlanManager}
                mapParams={mapParams}
                clipPath="url(#arc-mode-flight-plan-clip)"
                debug={false}
            />

            <Overlay heading={Number(MathUtils.fastToFixed(magHeading, 1))} rangeIndex={rangeIndex} side={side} tcasMode={tcasMode} />

            <ToWaypointIndicator info={flightPlanManager.getCurrentFlightPlan().computeActiveWaypointStatistics(ppos)} />

            <ApproachMessage info={flightPlanManager.getAirportApproach()} flightPhase={fmgcFlightPhase} />
        </>
    );
};

type OverlayProps = {
    heading: number,
    rangeIndex: number,
    side: 'L' | 'R',
    tcasMode: number,
}

const Overlay: React.FC<OverlayProps> = memo(({ heading, rangeIndex, side, tcasMode }) => {
    const range = rangeSettings[rangeIndex];

    return (
        <>
            <clipPath id="arc-mode-flight-plan-clip">
                <circle cx={384} cy={620} r={724} />
            </clipPath>
            <clipPath id="arc-mode-overlay-clip-4">
                <path d="m 6 0 h 756 v 768 h -756 z" />
            </clipPath>
            <clipPath id="arc-mode-overlay-clip-3">
                <path d="m 0 564 l 384 145 l 384 -145 v -564 h -768 z" />
            </clipPath>
            <clipPath id="arc-mode-overlay-clip-2">
                <path d="m 0 532 l 384 155 l 384 -146 v -512 h -768 z" />
            </clipPath>
            <clipPath id="arc-mode-overlay-clip-1">
                <path d="m 0 519 l 384 145 l 384 -86 v -580 h -768 z" />
            </clipPath>

            {/* C = 384,620 */}
            <g transform="rotateX(0deg)" stroke="white" strokeWidth={3} fill="none">
                <g clipPath="url(#arc-mode-overlay-clip-4)">
                    {/* R = 492 */}
                    <path
                        d="M-108,620a492,492 0 1,0 984,0a492,492 0 1,0 -984,0"
                        strokeWidth={3.25}
                    />
                    <Arc heading={heading} />
                </g>

                {/* R = 369 */}
                <path
                    d="M15,620a369,369 0 1,0 738,0a369,369 0 1,0 -738,0"
                    strokeDasharray="15 10.5"
                    strokeDashoffset="15"
                    clipPath="url(#arc-mode-overlay-clip-3)"
                />
                <text x={58} y={482} fill="#00ffff" stroke="none" fontSize={22}>{(range / 4) * 3}</text>
                <text x={709} y={482} textAnchor="end" fill="#00ffff" stroke="none" fontSize={22}>{(range / 4) * 3}</text>

                {/* R = 246 */}
                <path
                    d="M138,620a246,246 0 1,0 492,0a246,246 0 1,0 -492,00"
                    strokeDasharray="15 10"
                    strokeDashoffset="-6"
                    clipPath="url(#arc-mode-overlay-clip-2)"
                />
                <text x={168} y={528} fill="#00ffff" stroke="none" fontSize={22}>{range / 2}</text>
                <text x={592} y={528} textAnchor="end" fill="#00ffff" stroke="none" fontSize={22}>{range / 2}</text>

                {/* R = 123 */}
                { (tcasMode === 0 || range > 10)
                    && (
                        <path
                            d="M261,620a123,123 0 1,0 246,0a123,123 0 1,0 -246,00"
                            strokeDasharray="15 10"
                            strokeDashoffset="-4.2"
                            clipPath="url(#arc-mode-overlay-clip-1)"
                        />
                    )}
                { (tcasMode > 0 && range === 10)
                    && (
                        <g>
                            <line x1={384} x2={384} y1={497 - 6} y2={497 + 6} className="White rounded" transform="rotate(-60 384 620)" />
                            <line x1={384} x2={384} y1={497 - 6} y2={497 + 6} className="White rounded" transform="rotate(-30 384 620)" />
                            <line x1={384} x2={384} y1={497 - 6} y2={497 + 6} className="White rounded" transform="rotate(0 384 620)" />
                            <line x1={384} x2={384} y1={497 - 6} y2={497 + 6} className="White rounded" transform="rotate(30 384 620)" />
                            <line x1={384} x2={384} y1={497 - 6} y2={497 + 6} className="White rounded" transform="rotate(60 384 620)" />
                        </g>
                    )}

                {/* R = 62 */}
                { (tcasMode > 0 && range === 20)
                    && (
                        <g>
                            <line x1={384} x2={384} y1={558 - 6} y2={558 + 6} className="White rounded" transform="rotate(-60 384 620)" />
                            <line x1={384} x2={384} y1={558 - 6} y2={558 + 6} className="White rounded" transform="rotate(-30 384 620)" />
                            <line x1={384} x2={384} y1={558 - 6} y2={558 + 6} className="White rounded" transform="rotate(0 384 620)" />
                            <line x1={384} x2={384} y1={558 - 6} y2={558 + 6} className="White rounded" transform="rotate(30 384 620)" />
                            <line x1={384} x2={384} y1={558 - 6} y2={558 + 6} className="White rounded" transform="rotate(60 384 620)" />
                        </g>
                    )}
            </g>

            <RadioNeedle index={1} side={side} />
            <RadioNeedle index={2} side={side} />

            <Plane />
        </>
    );
});
