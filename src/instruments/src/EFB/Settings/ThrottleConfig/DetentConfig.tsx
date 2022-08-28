// Copyright (c) 2022 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { t } from '../../translation';

import { SimpleInput } from '../../UtilComponents/Form/SimpleInput/SimpleInput';
import { ProgressBar } from '../../UtilComponents/Progress/Progress';

interface Props {
    upperBoundDetentSetter,
    lowerBoundDetentSetter,
    lowerBoundDetentGetter,
    upperBoundDetentGetter,
    detentValue,
    throttleNumber,
    throttlePosition,
    index,
    expertMode: boolean,
}

const DetentConfig: React.FC<Props> = (props: Props) => {
    const [showWarning, setShowWarning] = useState(false);

    const [deadZone, setDeadZone] = useState(Math.abs(props.upperBoundDetentGetter - props.lowerBoundDetentGetter) / 2);

    const [previousMode, setPreviousMode] = useState(props.expertMode);

    const setFromTo = (throttle1Position, settingLower, settingUpper, deadZone: number, overrideValue?: string) => {
        const newSetting = overrideValue || throttle1Position;

        settingLower.forEach((f) => f(newSetting - deadZone < -1 ? -1 : newSetting - deadZone));
        settingUpper.forEach((f) => f(newSetting + deadZone > 1 ? 1 : newSetting + deadZone));
    };

    useEffect(() => {
        setPreviousMode(props.expertMode);
    }, [props.expertMode]);

    return (
        <div className="flex overflow-hidden flex-col flex-shrink-0 justify-between items-center text-white">
            <ProgressBar
                height="225px"
                width="40px"
                isLabelVisible={false}
                displayBar
                borderRadius="0px"
                completedBarBegin={(props.lowerBoundDetentGetter + 1) * 50}
                completedBarBeginValue={props.lowerBoundDetentGetter.toFixed(2)}
                completedBarEnd={(props.upperBoundDetentGetter + 1) * 50}
                completedBarEndValue={props.upperBoundDetentGetter.toFixed(2)}
                bgcolor="var(--color-highlight)"
                vertical
                baseBgColor="var(--color-accent)"
                completed={(props.throttlePosition + 1) / 2 * 100}
                completionValue={props.throttlePosition}
                greenBarsWhenInRange
            />

            <div className="flex flex-col">
                {!props.expertMode
                    && (
                        <div className="my-2">
                            <div>
                                <p>
                                    {t('Settings.ThrottleConfig.Deadband')}
                                    {' '}
                                    +/-
                                </p>
                            </div>
                            <div>
                                <SimpleInput
                                    className="mb-6 w-60"
                                    value={deadZone.toFixed(2)}
                                    reverse
                                    onChange={(deadZone) => {
                                        if (parseFloat(deadZone) >= 0.01) {
                                            if (previousMode === props.expertMode) {
                                                setShowWarning(false);
                                                setDeadZone(parseFloat(deadZone));
                                            }
                                        } else {
                                            setShowWarning(true);
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <button
                                    className="py-1 px-2 w-60 rounded-md border-2 transition duration-100 text-theme-body hover:text-theme-highlight bg-theme-highlight hover:bg-theme-body border-theme-highlight"
                                    onClick={() => {
                                        setFromTo(props.throttlePosition, props.lowerBoundDetentSetter, props.upperBoundDetentSetter, deadZone);
                                    }}
                                    type="button"
                                >
                                    {t('Settings.ThrottleConfig.SetFromThrottle')}
                                </button>
                            </div>
                        </div>
                    )}
                {props.expertMode
                    && (
                        <div className="my-2">
                            <p>{t('Settings.ThrottleConfig.ConfigureEnd')}</p>
                            <SimpleInput
                                reverse
                                className="mr-0 w-60"
                                value={!props.expertMode ? deadZone : props.upperBoundDetentGetter.toFixed(2)}
                                onChange={(deadZone) => {
                                    if (previousMode === props.expertMode && deadZone.length > 1 && !Number.isNaN(Number(deadZone))) {
                                        props.upperBoundDetentSetter.forEach((f) => f(parseFloat(deadZone)));
                                        setShowWarning(false);
                                    }
                                }}
                            />

                            <p>{props.expertMode ? t('Settings.ThrottleConfig.ConfigureStart') : t('Settings.ThrottleConfig.Deadband')}</p>
                            <SimpleInput
                                className="mt-2 w-60"
                                reverse
                                value={!props.expertMode ? deadZone : props.lowerBoundDetentGetter.toFixed(2)}
                                onChange={(deadZone) => {
                                    if (previousMode === props.expertMode && deadZone.length > 1 && !Number.isNaN(Number(deadZone))) {
                                        props.lowerBoundDetentSetter.forEach((f) => f(parseFloat(deadZone)));
                                        setShowWarning(false);
                                    }
                                }}
                            />
                        </div>
                    )}
                <h2 style={{ visibility: showWarning ? 'visible' : 'hidden' }} className="my-2 w-48 h-12 text-xl text-utility-red">
                    {t('Settings.ThrottleConfig.PleaseEnterAValidDeadzone')}
                    {' '}
                    (&gt; 0.05)
                </h2>

            </div>
        </div>
    );
};
export default DetentConfig;
