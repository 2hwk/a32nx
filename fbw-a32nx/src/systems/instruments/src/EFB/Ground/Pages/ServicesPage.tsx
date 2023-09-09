// Copyright (c) 2022 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

/* eslint-disable no-console */
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSimVar } from '@flybywiresim/fbw-sdk';
import {
    ArchiveFill,
    ConeStriped,
    DoorClosedFill,
    HandbagFill,
    PersonPlusFill,
    PlugFill,
    TriangleFill as Chock,
    Truck,
    VinylFill as Wheel,
} from 'react-bootstrap-icons';
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import { t } from '../../translation';
import { A380GroundServiceOutline, GroundServiceOutline } from '../../Assets/GroundServiceOutline';
import { useAppDispatch, useAppSelector } from '../../Store/store';
import {
    setAftRightDoorButtonState,
    setAftLeftDoorButtonState,
    setBaggageButtonState,
    setCabinLeftDoorButtonState,
    setCabinRightDoorButtonState,
    setCargoDoorButtonState,
    setCateringButtonState,
    setFuelTruckButtonState,
    setGpuButtonState,
    setJetWayButtonState,
} from '../../Store/features/groundServicePage';
import { getAirframeType } from '../../Efb';

interface ServiceButtonWrapperProps {
    className?: string,
    xl?: number,
    xr?: number,
    y: number
}

// This groups buttons and sets a border and divider line
const ServiceButtonWrapper: FC<ServiceButtonWrapperProps> = ({ children, className, xl, xr, y }) => (
    <div
        className={`flex flex-col rounded-xl border-2 border-theme-accent divide-y-2 divide-theme-accent overflow-hidden ${className}`}
        style={{ position: 'absolute', left: xl, right: xr, top: y }}
    >
        {children}
    </div>
);

enum ServiceButton {
    CabinLeftDoor,
    CabinRightDoor,
    JetBridge,
    FuelTruck,
    Gpu,
    CargoDoor,
    BaggageTruck,
    AftLeftDoor,
    AftRightDoor,
    CateringTruck
}

// Possible states of buttons
// Order is important to allow simpler if-statements to check for button state
enum ServiceButtonState {
    HIDDEN,
    DISABLED,
    INACTIVE,
    CALLED,
    ACTIVE,
    RELEASED,
}

interface GroundServiceButtonProps {
    name: string,
    state: ServiceButtonState,
    onClick: () => void,
    className?: string,
}

// Button styles based on ServiceButtonState enum
const buttonsStyles: Record<ServiceButtonState, string> = {
    [ServiceButtonState.HIDDEN]: '',
    [ServiceButtonState.DISABLED]: 'opacity-20 pointer-events-none',
    [ServiceButtonState.INACTIVE]: 'hover:bg-theme-highlight text-theme-text hover:text-theme-secondary transition duration-200 disabled:bg-grey-600',
    [ServiceButtonState.CALLED]: 'text-white bg-amber-600 border-amber-600 hover:bg-amber-400',
    [ServiceButtonState.ACTIVE]: 'text-white bg-green-700 border-green-700 hover:bg-green-500 hover:text-theme-secondary',
    [ServiceButtonState.RELEASED]: 'text-white bg-amber-600 border-amber-600 pointer-events-none',
};

const GroundServiceButton: React.FC<GroundServiceButtonProps> = ({ children, name, state, onClick, className }) => {
    if (state === ServiceButtonState.HIDDEN) {
        return (<></>);
    }

    return (
        <div
            className={`flex flex-row items-center space-x-6 py-6 px-6 cursor-pointer ${buttonsStyles[state]} ${className}`}
            onClick={state === ServiceButtonState.DISABLED ? undefined : onClick}
        >
            {children}
            <h1 className="flex-shrink-0 text-2xl font-medium text-current">{name}</h1>
        </div>
    );
};

export const ServicesPage = () => {
    const dispatch = useAppDispatch();

    const [airframe] = useState(getAirframeType());

    // Flight state
    const [simOnGround] = useSimVar('SIM ON GROUND', 'bool', 250);
    const [aircraftIsStationary] = useSimVar('L:A32NX_IS_STATIONARY', 'bool', 250);
    const [pushBackAttached] = useSimVar('Pushback Attached', 'enum', 250);
    const groundServicesAvailable = simOnGround && aircraftIsStationary && !pushBackAttached;

    // Ground Services
    const [cabinLeftDoorOpen] = useSimVar('A:INTERACTIVE POINT OPEN:0', 'Percent over 100', 100);
    const [cabinRightDoorOpen] = useSimVar('A:INTERACTIVE POINT OPEN:1', 'Percent over 100', 100);
    const [aftLeftDoorOpen] = useSimVar('A:INTERACTIVE POINT OPEN:2', 'Percent over 100', 100);
    const [aftRightDoorOpen] = useSimVar('A:INTERACTIVE POINT OPEN:3', 'Percent over 100', 100);
    const [cargoDoorOpen] = useSimVar('A:INTERACTIVE POINT OPEN:5', 'Percent over 100', 100);
    const [gpuActive] = useSimVar('A:INTERACTIVE POINT OPEN:8', 'Percent over 100', 100);
    const [fuelingActive] = useSimVar('A:INTERACTIVE POINT OPEN:9', 'Percent over 100', 100);

    // Wheel Chocks and Cones
    const [isGroundEquipmentVisible] = useSimVar('L:A32NX_GND_EQP_IS_VISIBLE', 'bool', 500);
    const [wheelChocksEnabled] = useSimVar('L:A32NX_MODEL_WHEELCHOCKS_ENABLED', 'bool', 500);
    const [conesEnabled] = useSimVar('L:A32NX_MODEL_CONES_ENABLED', 'bool', 500);
    const wheelChocksVisible = wheelChocksEnabled && isGroundEquipmentVisible;
    const conesVisible = conesEnabled && isGroundEquipmentVisible;

    // Service events
    const toggleCabinLeftDoor = () => SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 1);
    const toggleCabinRightDoor = () => SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 2);
    const toggleJetBridgeAndStairs = () => {
        SimVar.SetSimVarValue('K:TOGGLE_JETWAY', 'bool', false);
        SimVar.SetSimVarValue('K:TOGGLE_RAMPTRUCK', 'bool', false);
    };
    const toggleCargoDoor = () => SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 6);
    const toggleBaggageTruck = () => SimVar.SetSimVarValue('K:REQUEST_LUGGAGE', 'bool', true);
    const toggleAftLeftDoor = () => SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 3);
    const toggleAftRightDoor = () => SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 4);
    const toggleCateringTruck = () => SimVar.SetSimVarValue('K:REQUEST_CATERING', 'bool', true);
    const toggleFuelTruck = () => SimVar.SetSimVarValue('K:REQUEST_FUEL_KEY', 'bool', true);
    const toggleGpu = () => SimVar.SetSimVarValue('K:REQUEST_POWER_SUPPLY', 'bool', true);

    // Button states
    const {
        cabinLeftDoorButtonState,
        cabinRightDoorButtonState,
        jetWayButtonState,
        fuelTruckButtonState,
        gpuButtonState,
        cargoDoorButtonState,
        baggageButtonState,
        aftLeftDoorButtonState,
        aftRightDoorButtonState,
        cateringButtonState,
    } = useAppSelector((state) => state.groundServicePage);

    // Required so these can be used inside the useTimeout callback
    const jetWayButtonStateRef = useRef(jetWayButtonState);
    jetWayButtonStateRef.current = jetWayButtonState;
    const baggageButtonStateRef = useRef(baggageButtonState);
    baggageButtonStateRef.current = baggageButtonState;
    const cateringButtonStateRef = useRef(cateringButtonState);
    cateringButtonStateRef.current = cateringButtonState;

    // handles state changes to complex services: Jetway, Stairs, Baggage, Catering
    const handleComplexService = (
        serviceButton: ServiceButton,
        serviceButtonStateRef: React.MutableRefObject<ServiceButtonState>,
        setButtonState: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
        doorButtonState: ServiceButtonState,
        setDoorButtonState: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
        doorOpenState: number,
    ) => {
        // Service Button handling
        if (serviceButtonStateRef.current === ServiceButtonState.INACTIVE) {
            dispatch(setButtonState(ServiceButtonState.CALLED));
            // If door was already open use a timer to set to active
            // as the useEffect will never be called.
            if (doorOpenState === 1) {
                setTimeout(() => {
                    dispatch(setButtonState(ServiceButtonState.ACTIVE));
                }, 5000);
            }
        } else if (serviceButtonStateRef.current === ServiceButtonState.CALLED) {
            // When in state CALLED another click on the button cancels the request.
            // This prevents another click after a "called" has been cancelled
            // to avoid state getting out of sync.
            dispatch(setButtonState(ServiceButtonState.DISABLED));
            setTimeout(() => {
                dispatch(setButtonState(ServiceButtonState.INACTIVE));
            }, 5500);
        } else {
            console.assert(serviceButtonStateRef.current === ServiceButtonState.ACTIVE,
                'Expected %s to be in state %s but was in state %s',
                ServiceButton[serviceButton],
                ServiceButtonState[ServiceButtonState.ACTIVE],
                ServiceButtonState[serviceButtonStateRef.current]);
            dispatch(setButtonState(ServiceButtonState.RELEASED));
            // If there is no service vehicle/jet-bridge available the door would
            // never receive a close event, so we need to set the button state
            // to inactive after a timeout.
            setTimeout(() => {
                if (doorOpenState === 1) {
                    dispatch(setButtonState(ServiceButtonState.INACTIVE));
                }
            }, 5000);
        }

        // Door Button: enable door button after a timeout if it was disabled
        if (doorButtonState === ServiceButtonState.DISABLED) {
            setTimeout(() => {
                // service button could have been pressed again in the meantime
                if (serviceButtonStateRef.current < ServiceButtonState.CALLED) {
                    if (doorOpenState === 1) {
                        dispatch(setDoorButtonState(ServiceButtonState.ACTIVE));
                    } else {
                        dispatch(setDoorButtonState(ServiceButtonState.INACTIVE));
                    }
                }
            }, 5000);
        } else {
            // disable the door button if the service button has been pressed
            dispatch(setDoorButtonState(ServiceButtonState.DISABLED));
        }
    };

    // handles state changes for simple services: fuel, gpu
    const handleSimpleService = (
        button: ServiceButton,
        buttonState: ServiceButtonState,
        setButtonState: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
    ) => {
        // Toggle called/released
        if (buttonState === ServiceButtonState.INACTIVE) {
            dispatch(setButtonState(ServiceButtonState.CALLED));
        } else if (buttonState === ServiceButtonState.CALLED) {
            dispatch(setButtonState(ServiceButtonState.INACTIVE));
        } else {
            console.assert(buttonState === ServiceButtonState.ACTIVE,
                'Expected %s to be in state %s but was in state %s',
                ServiceButton[button],
                ServiceButtonState[ServiceButtonState.ACTIVE],
                ServiceButtonState[buttonState]);
            dispatch(setButtonState(ServiceButtonState.RELEASED));
        }
    };

    // handles state changes to doors
    const handleDoors = (
        buttonState: ServiceButtonState,
        setter: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
    ) => {
        switch (buttonState) {
        case ServiceButtonState.INACTIVE:
            dispatch(setter(ServiceButtonState.CALLED));
            break;
        case ServiceButtonState.CALLED:
        case ServiceButtonState.ACTIVE:
            dispatch(setter(ServiceButtonState.RELEASED));
            break;
        case ServiceButtonState.RELEASED:
            dispatch(setter(ServiceButtonState.CALLED));
            break;
        default:
            break;
        }
    };

    // Centralized handler for managing clicks to any button
    const handleButtonClick = (id: ServiceButton) => {
        switch (id) {
        case ServiceButton.CabinLeftDoor:
            handleDoors(cabinLeftDoorButtonState, setCabinLeftDoorButtonState);
            toggleCabinLeftDoor();
            break;
        case ServiceButton.CabinRightDoor:
            handleDoors(cabinRightDoorButtonState, setCabinRightDoorButtonState);
            toggleCabinRightDoor();
            break;
        case ServiceButton.CargoDoor:
            handleDoors(cargoDoorButtonState, setCargoDoorButtonState);
            toggleCargoDoor();
            break;
        case ServiceButton.AftLeftDoor:
            handleDoors(aftLeftDoorButtonState, setAftLeftDoorButtonState);
            toggleAftLeftDoor();
            break;
        case ServiceButton.AftRightDoor:
            handleDoors(aftRightDoorButtonState, setAftRightDoorButtonState);
            toggleAftRightDoor();
            break;
        case ServiceButton.FuelTruck:
            handleSimpleService(ServiceButton.FuelTruck, fuelTruckButtonState, setFuelTruckButtonState);
            toggleFuelTruck();
            break;
        case ServiceButton.Gpu:
            handleSimpleService(ServiceButton.Gpu, gpuButtonState, setGpuButtonState);
            toggleGpu();
            break;
        case ServiceButton.JetBridge:
            handleComplexService(ServiceButton.JetBridge,
                jetWayButtonStateRef, setJetWayButtonState,
                cabinLeftDoorButtonState, setCabinLeftDoorButtonState,
                cabinLeftDoorOpen);
            toggleJetBridgeAndStairs();
            break;
        case ServiceButton.BaggageTruck:
            handleComplexService(ServiceButton.BaggageTruck,
                baggageButtonStateRef, setBaggageButtonState,
                cargoDoorButtonState, setCargoDoorButtonState,
                cargoDoorOpen);
            toggleBaggageTruck();
            break;
        case ServiceButton.CateringTruck:
            handleComplexService(ServiceButton.CateringTruck,
                cateringButtonStateRef, setCateringButtonState,
                aftRightDoorButtonState, setAftRightDoorButtonState,
                aftRightDoorOpen);
            toggleCateringTruck();
            break;
        default:
            break;
        }
    };

    // Called by useEffect listeners  whenever a specific door state for
    // simple services and doors changes.
    // Determines the state of a door or simple service based on a given
    // door state input. All services are basically active and terminated
    // based on a door state (INTERACTION POINT OPEN)
    const simpleServiceListenerHandling = (
        state: ServiceButtonState,
        setter: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
        doorState: number,
    ) => {
        if (state <= ServiceButtonState.DISABLED) {
            return;
        }
        switch (doorState) {
        case 0: // closed
            if (state !== ServiceButtonState.CALLED) {
                dispatch(setter(ServiceButtonState.INACTIVE));
            }
            break;
        case 1: // open
            dispatch(setter(ServiceButtonState.ACTIVE));
            break;
        default: // in between
            if (state === ServiceButtonState.ACTIVE) {
                dispatch(setter(ServiceButtonState.RELEASED));
            }
            break;
        }
    };

    // Called by useEffect listeners whenever a specific door state for a complex services changes
    const complexServiceListenerHandling = (
        serviceButtonStateRef: React.MutableRefObject<ServiceButtonState>,
        setterServiceButtonState: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
        doorButtonState: ServiceButtonState,
        setterDoorButtonState1: ActionCreatorWithOptionalPayload<ServiceButtonState, string>,
        doorState: number,
    ) => {
        switch (serviceButtonStateRef.current) {
        case ServiceButtonState.HIDDEN:
        case ServiceButtonState.DISABLED:
        case ServiceButtonState.INACTIVE:
            break;
        case ServiceButtonState.CALLED:
            if (doorState === 1) dispatch(setterServiceButtonState(ServiceButtonState.ACTIVE));
            if (doorState === 0) dispatch(setterServiceButtonState(ServiceButtonState.INACTIVE));
            break;
        case ServiceButtonState.ACTIVE:
            if (doorState < 1 && doorState > 0) dispatch(setterServiceButtonState(ServiceButtonState.RELEASED));
            if (doorState === 0) dispatch(setterServiceButtonState(ServiceButtonState.INACTIVE));
            break;
        case ServiceButtonState.RELEASED:
            if (doorState === 0) dispatch(setterServiceButtonState(ServiceButtonState.INACTIVE));
            break;
        default:
        }
        // enable door button in case door has been closed by other means (e.g. pushback)
        if (doorState < 1
            && serviceButtonStateRef.current >= ServiceButtonState.ACTIVE
            && doorButtonState === ServiceButtonState.DISABLED) {
            setTimeout(() => {
                // double-check as service button could have been pressed again in the meantime
                if (groundServicesAvailable
                    && serviceButtonStateRef.current < ServiceButtonState.CALLED) {
                    dispatch(setterDoorButtonState1(ServiceButtonState.INACTIVE));
                }
            }, 5000);
        }
    };

    // Doors
    useEffect(() => {
        simpleServiceListenerHandling(cabinLeftDoorButtonState, setCabinLeftDoorButtonState, cabinLeftDoorOpen);
        simpleServiceListenerHandling(cabinRightDoorButtonState, setCabinRightDoorButtonState, cabinRightDoorOpen);
        simpleServiceListenerHandling(cargoDoorButtonState, setCargoDoorButtonState, cargoDoorOpen);
        simpleServiceListenerHandling(aftLeftDoorButtonState, setAftLeftDoorButtonState, aftLeftDoorOpen);
        simpleServiceListenerHandling(aftRightDoorButtonState, setAftRightDoorButtonState, aftRightDoorOpen);
    }, [cabinRightDoorOpen, cabinLeftDoorOpen, cargoDoorOpen, aftLeftDoorOpen, aftRightDoorOpen]);

    // Fuel
    useEffect(() => {
        simpleServiceListenerHandling(fuelTruckButtonState, setFuelTruckButtonState, fuelingActive);
    }, [fuelingActive]);

    // Gpu
    useEffect(() => {
        simpleServiceListenerHandling(gpuButtonState, setGpuButtonState, gpuActive);
    }, [gpuActive]);

    // Cabin Door listener for JetBridge Button
    useEffect(() => {
        complexServiceListenerHandling(
            jetWayButtonStateRef,
            setJetWayButtonState,
            cabinLeftDoorButtonState,
            setCabinLeftDoorButtonState,
            cabinLeftDoorOpen,
        );
    }, [cabinLeftDoorOpen]);

    // Cargo Door listener for Baggage Button
    useEffect(() => {
        complexServiceListenerHandling(
            baggageButtonStateRef,
            setBaggageButtonState,
            cargoDoorButtonState,
            setCargoDoorButtonState,
            cargoDoorOpen,
        );
    }, [cargoDoorOpen]);

    // Aft Cabin Door listener for Catering Button
    useEffect(() => {
        complexServiceListenerHandling(
            cateringButtonStateRef,
            setCateringButtonState,
            aftRightDoorButtonState,
            setAftRightDoorButtonState,
            aftRightDoorOpen,
        );
    }, [aftRightDoorOpen]);

    // Pushback or movement start --> disable buttons and close doors
    // Enable buttons if all have been disabled before
    useEffect(() => {
        if (!groundServicesAvailable) {
            dispatch(setCabinLeftDoorButtonState(ServiceButtonState.DISABLED));
            dispatch(setCabinRightDoorButtonState(ServiceButtonState.DISABLED));
            dispatch(setJetWayButtonState(ServiceButtonState.DISABLED));
            dispatch(setFuelTruckButtonState(ServiceButtonState.DISABLED));
            dispatch(setGpuButtonState(ServiceButtonState.DISABLED));
            dispatch(setCargoDoorButtonState(ServiceButtonState.DISABLED));
            dispatch(setBaggageButtonState(ServiceButtonState.DISABLED));
            dispatch(setAftLeftDoorButtonState(ServiceButtonState.DISABLED));
            dispatch(setAftRightDoorButtonState(ServiceButtonState.DISABLED));
            dispatch(setCateringButtonState(ServiceButtonState.DISABLED));
            if (cabinLeftDoorOpen === 1) {
                SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 1);
            }
            if (cabinRightDoorOpen === 1) {
                SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 2);
            }
            if (aftLeftDoorOpen === 1) {
                SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 3);
            }
            if (aftRightDoorOpen === 1) {
                SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 4);
            }
            if (cargoDoorOpen === 1) {
                SimVar.SetSimVarValue('K:TOGGLE_AIRCRAFT_EXIT', 'enum', 6);
            }
        } else if (
            [cateringButtonState,
                jetWayButtonState,
                fuelTruckButtonState,
                gpuButtonState,
                cargoDoorButtonState,
                baggageButtonState,
                aftLeftDoorButtonState,
                aftRightDoorButtonState,
                cateringButtonState]
                .every((buttonState) => buttonState === ServiceButtonState.DISABLED)
        ) {
            dispatch(setCabinLeftDoorButtonState(ServiceButtonState.INACTIVE));
            dispatch(setCabinRightDoorButtonState(ServiceButtonState.INACTIVE));
            dispatch(setJetWayButtonState(ServiceButtonState.INACTIVE));
            dispatch(setFuelTruckButtonState(ServiceButtonState.INACTIVE));
            dispatch(setGpuButtonState(ServiceButtonState.INACTIVE));
            dispatch(setCargoDoorButtonState(ServiceButtonState.INACTIVE));
            dispatch(setBaggageButtonState(ServiceButtonState.INACTIVE));
            dispatch(setAftLeftDoorButtonState(ServiceButtonState.INACTIVE));
            dispatch(setAftRightDoorButtonState(ServiceButtonState.INACTIVE));
            dispatch(setCateringButtonState(ServiceButtonState.INACTIVE));
        }
    }, [groundServicesAvailable]);

    const serviceIndicationCss = 'text-2xl font-bold text-utility-amber w-min';

    return (
        <div className="relative h-content-section-reduced">
            {airframe === 'A380_842' ? <A380GroundServiceOutline className="inset-x-0 mx-auto w-full h-full text-theme-text" />
                : <GroundServiceOutline className="inset-x-0 mx-auto w-full h-full text-theme-text" /> }

            <ServiceButtonWrapper xr={880} y={24}>

                {/* CABIN DOOR */}
                <GroundServiceButton
                    name={t('Ground.Services.DoorFwd')}
                    state={cabinLeftDoorButtonState}
                    onClick={() => handleButtonClick(ServiceButton.CabinLeftDoor)}
                >
                    <DoorClosedFill size={36} />
                </GroundServiceButton>

                {/* JET BRIDGE */}
                <GroundServiceButton
                    name={t('Ground.Services.JetBridge')}
                    state={jetWayButtonState}
                    onClick={() => handleButtonClick(ServiceButton.JetBridge)}
                >
                    <PersonPlusFill size={36} />
                </GroundServiceButton>

                {/* FUEL TRUCK */}
                <GroundServiceButton
                    name={t('Ground.Services.FuelTruck')}
                    state={fuelTruckButtonState}
                    onClick={() => handleButtonClick(ServiceButton.FuelTruck)}
                >
                    <Truck size={36} />
                </GroundServiceButton>

            </ServiceButtonWrapper>

            <ServiceButtonWrapper xl={850} y={24} className="">

                {/* CABIN DOOR */}
                <GroundServiceButton
                    name={t('Ground.Services.DoorFwd')}
                    state={cabinRightDoorButtonState}
                    onClick={() => handleButtonClick(ServiceButton.CabinRightDoor)}
                >
                    <DoorClosedFill size={36} />
                </GroundServiceButton>

                {/* GPU */}
                <GroundServiceButton
                    name={t('Ground.Services.ExternalPower')}
                    state={gpuButtonState}
                    onClick={() => handleButtonClick(ServiceButton.Gpu)}
                >
                    <PlugFill size={36} />
                </GroundServiceButton>

                {/* CARGO DOOR */}
                <GroundServiceButton
                    name={t('Ground.Services.DoorCargo')}
                    state={cargoDoorButtonState}
                    onClick={() => handleButtonClick(ServiceButton.CargoDoor)}
                >
                    <DoorClosedFill size={36} />
                </GroundServiceButton>

                {/* BAGGAGE TRUCK */}
                <GroundServiceButton
                    name={t('Ground.Services.BaggageTruck')}
                    state={baggageButtonState}
                    onClick={() => handleButtonClick(ServiceButton.BaggageTruck)}
                >
                    <HandbagFill size={36} />
                </GroundServiceButton>

            </ServiceButtonWrapper>

            <ServiceButtonWrapper xl={850} y={600} className="">

                {/* AFT DOOR */}
                <GroundServiceButton
                    name={t('Ground.Services.DoorAft')}
                    state={aftRightDoorButtonState}
                    onClick={() => handleButtonClick(ServiceButton.AftRightDoor)}
                >
                    <DoorClosedFill size={36} />
                </GroundServiceButton>

                {/* CATERING TRUCK */}
                <GroundServiceButton
                    name={t('Ground.Services.CateringTruck')}
                    state={cateringButtonState}
                    onClick={() => handleButtonClick(ServiceButton.CateringTruck)}
                >
                    <ArchiveFill size={36} />
                </GroundServiceButton>

            </ServiceButtonWrapper>

            <ServiceButtonWrapper xr={880} y={600} className="">
                {/* AFT DOOR */}
                <GroundServiceButton
                    name={t('Ground.Services.DoorAft')}
                    state={aftLeftDoorButtonState}
                    onClick={() => handleButtonClick(ServiceButton.AftLeftDoor)}
                >
                    <DoorClosedFill size={36} />
                </GroundServiceButton>
            </ServiceButtonWrapper>

            {/* Wheel Chocks and Security Cones are only visual information. To reuse styling */}
            {/* the ServiceButtonWrapper has been re-used. */}
            <ServiceButtonWrapper xr={800} y={600} className="border-0 divide-y-0">
                {!!wheelChocksEnabled && (
                    <div className={`flex flex-row items-center space-x-6 py-6 px-6 cursor-pointer ${(wheelChocksVisible) ? 'text-green-500' : 'text-gray-500'}`}>
                        <div className={`flex justify-center items-end -ml-2 -mr-[2px] ${(wheelChocksVisible) ? 'text-green-500' : 'text-gray-500'}`}>
                            <Chock size="12" stroke="4" />
                            <Wheel size="36" stroke="5" className="-mx-0.5" />
                            <Chock size="12" stroke="4" />
                        </div>
                        <h1 className="flex-shrink-0 text-2xl font-medium text-current">
                            {t('Ground.Services.WheelChocks')}
                        </h1>
                    </div>
                )}

                {!!conesEnabled && (
                    <div className={`flex flex-row items-center space-x-6 py-6 px-6 cursor-pointer ${(conesVisible) ? 'text-green-500' : 'text-gray-500'}`}>
                        <ConeStriped size="38" stroke="1.5" className="mr-2" />
                        <h1 className="flex-shrink-0 text-2xl font-medium text-current">
                            {t('Ground.Services.Cones')}
                        </h1>
                    </div>
                )}
            </ServiceButtonWrapper>

            {/* Visual indications for tug and doors */}
            {!!pushBackAttached && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 540, right: 0, top: 0 }}
                >
                    TUG
                </div>
            )}
            {!!cabinLeftDoorOpen && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 500, right: 0, top: 100 }}
                >
                    CABIN
                </div>
            )}
            {!!cabinRightDoorOpen && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 700, right: 0, top: 100 }}
                >
                    CABIN
                </div>
            )}
            {!!aftLeftDoorOpen && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 500, right: 0, top: 665 }}
                >
                    CABIN
                </div>
            )}
            {!!aftRightDoorOpen && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 700, right: 0, top: 665 }}
                >
                    CABIN
                </div>
            )}
            {!!cargoDoorOpen && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 700, right: 0, top: 165 }}
                >
                    CARGO
                </div>
            )}
            {!!gpuActive && (
                <div
                    className={serviceIndicationCss}
                    style={{ position: 'absolute', left: 700, right: 0, top: 60 }}
                >
                    GPU
                </div>
            )}
        </div>
    );
};
