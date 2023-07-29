/* eslint-disable max-len */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CloudArrowDown } from 'react-bootstrap-icons';
import { SeatFlags, Units, usePersistentNumberProperty, usePersistentProperty, useSeatFlags, useSimVar } from '@flybywiresim/fbw-sdk';
import { BoardingInput, MiscParamsInput, PayloadInputTable } from '../PayloadElements';
import { CargoWidget } from './Seating/CargoWidget';
import { ChartWidget } from '../Chart/ChartWidget';
import { CargoStationInfo, PaxStationInfo } from '../Seating/Constants';
import { t } from '../../../../translation';
import { TooltipWrapper } from '../../../../UtilComponents/TooltipWrapper';
import Loadsheet from './A380_842.json';
import Card from '../../../../UtilComponents/Card/Card';
import { SelectGroup, SelectItem } from '../../../../UtilComponents/Form/Select';
import { SeatMapWidget } from './Seating/SeatMapWidget';
import { isSimbriefDataLoaded } from '../../../../Store/features/simBrief';
import { PromptModal, useModals } from '../../../../UtilComponents/Modals/Modals';
import { useAppSelector } from '../../../../Store/store';

export const A380Payload = () => {
    const { usingMetric } = Units;
    const { showModal } = useModals();

    const [mainFwdA] = useSeatFlags(`L:${Loadsheet.seatMap[0].simVar}`, Loadsheet.seatMap[0].capacity);
    const [mainFwdB] = useSeatFlags(`L:${Loadsheet.seatMap[1].simVar}`, Loadsheet.seatMap[1].capacity);
    const [mainMid1A] = useSeatFlags(`L:${Loadsheet.seatMap[2].simVar}`, Loadsheet.seatMap[2].capacity);
    const [mainMid1B] = useSeatFlags(`L:${Loadsheet.seatMap[3].simVar}`, Loadsheet.seatMap[3].capacity);
    const [mainMid1C] = useSeatFlags(`L:${Loadsheet.seatMap[4].simVar}`, Loadsheet.seatMap[4].capacity);
    const [mainMid2A] = useSeatFlags(`L:${Loadsheet.seatMap[5].simVar}`, Loadsheet.seatMap[5].capacity);
    const [mainMid2B] = useSeatFlags(`L:${Loadsheet.seatMap[6].simVar}`, Loadsheet.seatMap[6].capacity);
    const [mainMid2C] = useSeatFlags(`L:${Loadsheet.seatMap[7].simVar}`, Loadsheet.seatMap[7].capacity);
    const [mainAftA] = useSeatFlags(`L:${Loadsheet.seatMap[8].simVar}`, Loadsheet.seatMap[8].capacity);
    const [mainAftB] = useSeatFlags(`L:${Loadsheet.seatMap[9].simVar}`, Loadsheet.seatMap[9].capacity);

    const [mainFwdADesired, setMainFwdADesired] = useSeatFlags(`L:${Loadsheet.seatMap[0].simVar}_DESIRED`, Loadsheet.seatMap[0].capacity);
    const [mainFwdBDesired, setMainFwdBDesired] = useSeatFlags(`L:${Loadsheet.seatMap[1].simVar}_DESIRED`, Loadsheet.seatMap[1].capacity);
    const [mainMid1ADesired, setMainMid1ADesired] = useSeatFlags(`L:${Loadsheet.seatMap[2].simVar}_DESIRED`, Loadsheet.seatMap[2].capacity);
    const [mainMid1BDesired, setMainMid1BDesired] = useSeatFlags(`L:${Loadsheet.seatMap[3].simVar}_DESIRED`, Loadsheet.seatMap[3].capacity);
    const [mainMid1CDesired, setMainMid1CDesired] = useSeatFlags(`L:${Loadsheet.seatMap[4].simVar}_DESIRED`, Loadsheet.seatMap[4].capacity);
    const [mainMid2ADesired, setMainMid2ADesired] = useSeatFlags(`L:${Loadsheet.seatMap[5].simVar}_DESIRED`, Loadsheet.seatMap[5].capacity);
    const [mainMid2BDesired, setMainMid2BDesired] = useSeatFlags(`L:${Loadsheet.seatMap[6].simVar}_DESIRED`, Loadsheet.seatMap[6].capacity);
    const [mainMid2CDesired, setMainMid2CDesired] = useSeatFlags(`L:${Loadsheet.seatMap[7].simVar}_DESIRED`, Loadsheet.seatMap[7].capacity);
    const [mainAftADesired, setMainAftADesired] = useSeatFlags(`L:${Loadsheet.seatMap[8].simVar}_DESIRED`, Loadsheet.seatMap[8].capacity);
    const [mainAftBDesired, setMainAftBDesired] = useSeatFlags(`L:${Loadsheet.seatMap[9].simVar}_DESIRED`, Loadsheet.seatMap[9].capacity);

    const activeFlags = useMemo(
        () => [mainFwdA, mainFwdB, mainMid1A, mainMid1B, mainMid1C, mainMid2A, mainMid2B, mainMid2C, mainAftA, mainAftB],
        [mainFwdA, mainFwdB, mainMid1A, mainMid1B, mainMid1C, mainMid2A, mainMid2B, mainMid2C, mainAftA, mainAftB],
    );
    const desiredFlags = useMemo(
        () => [mainFwdADesired, mainFwdBDesired, mainMid1ADesired, mainMid1BDesired, mainMid1CDesired, mainMid2ADesired, mainMid2BDesired, mainMid2CDesired, mainAftADesired, mainAftBDesired],
        [mainFwdADesired, mainFwdBDesired, mainMid1ADesired, mainMid1BDesired, mainMid1CDesired, mainMid2ADesired, mainMid2BDesired, mainMid2CDesired, mainAftADesired, mainAftBDesired],
    );
    const setDesiredFlags = useMemo(
        () => [setMainFwdADesired, setMainFwdBDesired, setMainMid1ADesired, setMainMid1BDesired, setMainMid1CDesired, setMainMid2ADesired, setMainMid2BDesired, setMainMid2CDesired, setMainAftADesired, setMainAftBDesired],
        [],
    );

    const [fwdBag] = useSimVar(`L:${Loadsheet.cargoMap[0].simVar}`, 'Number', 200);
    const [aftBag] = useSimVar(`L:${Loadsheet.cargoMap[1].simVar}`, 'Number', 200);
    const [aftBulk] = useSimVar(`L:${Loadsheet.cargoMap[2].simVar}`, 'Number', 200);

    const [fwdBagDesired, setFwdBagDesired] = useSimVar(`L:${Loadsheet.cargoMap[0].simVar}_DESIRED`, 'Number', 200);
    const [aftBagDesired, setAftBagDesired] = useSimVar(`L:${Loadsheet.cargoMap[1].simVar}_DESIRED`, 'Number', 200);
    const [aftBulkDesired, setAftBulkDesired] = useSimVar(`L:${Loadsheet.cargoMap[2].simVar}_DESIRED`, 'Number', 200);

    const cargo = useMemo(() => [fwdBag, aftBag, aftBulk], [fwdBag, aftBag, aftBulk]);
    const cargoDesired = useMemo(() => [fwdBagDesired, aftBagDesired, aftBulkDesired], [fwdBagDesired, aftBagDesired, aftBulkDesired]);
    const setCargoDesired = useMemo(() => [setFwdBagDesired, setAftBagDesired, setAftBulkDesired], []);

    const massUnitForDisplay = usingMetric ? 'KGS' : 'LBS';

    const simbriefDataLoaded = isSimbriefDataLoaded();
    const [boardingStarted, setBoardingStarted] = useSimVar('L:A32NX_BOARDING_STARTED_BY_USR', 'Bool', 200);
    const [boardingRate, setBoardingRate] = usePersistentProperty('CONFIG_BOARDING_RATE', 'REAL');
    const [paxWeight, setPaxWeight] = useSimVar('L:A32NX_WB_PER_PAX_WEIGHT', 'Kilograms', 200);
    const [paxBagWeight, setPaxBagWeight] = useSimVar('L:A32NX_WB_PER_BAG_WEIGHT', 'Kilograms', 200);
    // const [destEfob] = useSimVar('L:A32NX_DESTINATION_FUEL_ON_BOARD', 'Kilograms', 5_000);

    const [emptyWeight] = useSimVar('A:EMPTY WEIGHT', 'Kilograms', 10_000);

    const [stationSize, setStationLen] = useState<number[]>([]);
    const maxPax = useMemo(() => ((stationSize && stationSize.length > 0) ? stationSize.reduce((a, b) => a + b) : -1), [stationSize]);

    // Calculate Total Pax from Pax Flags
    const totalPax = useMemo(() => {
        let p = 0;
        activeFlags.forEach((flag) => {
            p += flag.getTotalFilledSeats();
        });
        return p;
    }, [...activeFlags]);

    const totalPaxDesired = useMemo(() => {
        let p = 0;
        desiredFlags.forEach((flag) => {
            p += flag.getTotalFilledSeats();
        });
        return p;
    }, [...desiredFlags]);

    const totalCargoDesired = useMemo(() => ((cargoDesired && cargoDesired.length > 0) ? cargoDesired.reduce((a, b) => a + b) : -1), [...cargoDesired]);
    const totalCargo = useMemo(() => ((cargo && cargo.length > 0) ? cargo.reduce((a, b) => a + b) : -1), [...cargo]);

    const [cargoStationWeights, setCargoStationWeight] = useState<number[]>([]);
    const maxCargo = useMemo(() => ((cargoStationWeights && cargoStationWeights.length > 0) ? cargoStationWeights.reduce((a, b) => a + b) : -1), [cargoStationWeights]);

    // Units
    // Weights
    const [zfw] = useSimVar('L:A32NX_ZFW', 'number', 200);
    const [zfwDesired] = useSimVar('L:A32NX_DESIRED_ZFW', 'number', 200);
    const [gw] = useSimVar('L:A32NX_GW', 'number', 200);
    const [gwDesired] = useSimVar('L:A32NX_DESIRED_GW', 'number', 200);
    const [totalFuel] = useSimVar('L:A32NX_FW', 'number', 200);

    // CG MAC
    const [zfwCgMac] = useSimVar('L:A32NX_ZFW_CG_PERCENT_MAC', 'number', 200);
    const [desiredZfwCgMac] = useSimVar('L:A32NX_DESIRED_ZFW_CG_PERCENT_MAC', 'number', 200);
    const [gwCgMac] = useSimVar('L:A32NX_GW_CG_PERCENT_MAC', 'number', 200);
    const [desiredGwCgMac] = useSimVar('L:A32NX_DESIRED_GW_CG_PERCENT_MAC', 'number', 200);

    const [seatMap] = useState<PaxStationInfo[]>(Loadsheet.seatMap);
    const [cargoMap] = useState<CargoStationInfo[]>(Loadsheet.cargoMap);

    const [showSimbriefButton, setShowSimbriefButton] = useState(false);
    const simbriefUnits = useAppSelector((state) => state.simbrief.data.units);
    const simbriefBagWeight = parseInt(useAppSelector((state) => state.simbrief.data.weights.bagWeight));
    const simbriefPaxWeight = parseInt(useAppSelector((state) => state.simbrief.data.weights.passengerWeight));
    const simbriefPax = parseInt(useAppSelector((state) => state.simbrief.data.weights.passengerCount));
    const simbriefBag = parseInt(useAppSelector((state) => state.simbrief.data.weights.bagCount));
    const simbriefFreight = parseInt(useAppSelector((state) => state.simbrief.data.weights.freight));

    const [displayZfw, setDisplayZfw] = useState(true);

    // GSX
    const [gsxPayloadSyncEnabled] = usePersistentNumberProperty('GSX_PAYLOAD_SYNC', 0);
    const [_, setGsxNumPassengers] = useSimVar('L:FSDT_GSX_NUMPASSENGERS', 'Number');
    const [gsxBoardingState] = useSimVar('L:FSDT_GSX_BOARDING_STATE', 'Number');
    const [gsxDeBoardingState] = useSimVar('L:FSDT_GSX_DEBOARDING_STATE', 'Number');
    const gsxStates = {
        AVAILABLE: 1,
        NOT_AVAILABLE: 2,
        BYPASSED: 3,
        REQUESTED: 4,
        PERFORMING: 5,
        COMPLETED: 6,
    };

    const setSimBriefValues = () => {
        if (simbriefUnits === 'kgs') {
            setPaxBagWeight(simbriefBagWeight);
            setPaxWeight(simbriefPaxWeight);
            setTargetPax(simbriefPax > maxPax ? maxPax : simbriefPax);
            setTargetCargo(simbriefBag, simbriefFreight, simbriefBagWeight);
        } else {
            setPaxBagWeight(Units.poundToKilogram(simbriefBagWeight));
            setPaxWeight(Units.poundToKilogram(simbriefPaxWeight));
            setTargetPax(simbriefPax);
            setTargetCargo(simbriefBag, Units.poundToKilogram(simbriefFreight), Units.poundToKilogram(simbriefBagWeight));
        }
    };

    const [busDC2] = useSimVar('L:A32NX_ELEC_DC_2_BUS_IS_POWERED', 'Bool', 2_000);
    const [busDCHot1] = useSimVar('L:A32NX_ELEC_DC_HOT_1_BUS_IS_POWERED', 'Bool', 2_000);
    const [simGroundSpeed] = useSimVar('GPS GROUND SPEED', 'knots', 2_000);
    const [isOnGround] = useSimVar('SIM ON GROUND', 'Bool', 2_000);
    const [eng1Running] = useSimVar('ENG COMBUSTION:1', 'Bool', 2_000);
    const [eng2Running] = useSimVar('ENG COMBUSTION:2', 'Bool', 2_000);
    const [coldAndDark, setColdAndDark] = useState<boolean>(true);

    const chooseDesiredSeats = useCallback((stationIndex: number, fillSeats: boolean = true, numChoose: number) => {
        const seatFlags: SeatFlags = desiredFlags[stationIndex];
        if (fillSeats) {
            seatFlags.fillEmptySeats(numChoose);
        } else {
            seatFlags.emptyFilledSeats(numChoose);
        }

        setDesiredFlags[stationIndex](seatFlags);
    }, [...desiredFlags]);

    const setTargetPax = useCallback((numOfPax: number) => {
        setGsxNumPassengers(numOfPax);

        if (!stationSize || numOfPax === totalPaxDesired || numOfPax > maxPax || numOfPax < 0) return;

        let paxRemaining = numOfPax;

        const fillStation = (stationIndex: number, percent: number, paxToFill: number) => {
            const sFlags: SeatFlags = desiredFlags[stationIndex];
            const toBeFilled = Math.min(Math.trunc(percent * paxToFill), stationSize[stationIndex]);

            paxRemaining -= toBeFilled;

            const planSeatedPax = sFlags.getTotalFilledSeats();
            chooseDesiredSeats(
                stationIndex,
                (toBeFilled > planSeatedPax),
                Math.abs(toBeFilled - planSeatedPax),
            );
        };

        for (let i = seatMap.length - 1; i > 0; i--) {
            fillStation(i, seatMap[i].fill, numOfPax);
        }
        fillStation(0, 1, paxRemaining);
    }, [maxPax, ...stationSize, ...seatMap, totalPaxDesired]);

    const setTargetCargo = useCallback((numberOfPax: number, freight: number, perBagWeight: number = paxBagWeight) => {
        const bagWeight = numberOfPax * perBagWeight;
        const loadableCargoWeight = Math.min(bagWeight + Math.round(freight), maxCargo);

        let remainingWeight = loadableCargoWeight;

        async function fillCargo(station: number, percent: number, loadableCargoWeight: number) {
            const c = Math.round(percent * loadableCargoWeight);
            remainingWeight -= c;
            setCargoDesired[station](c);
        }

        for (let i = cargoDesired.length - 1; i > 0; i--) {
            fillCargo(i, cargoStationWeights[i] / maxCargo, loadableCargoWeight);
        }
        fillCargo(0, 1, remainingWeight);
    }, [maxCargo, ...cargoStationWeights, ...cargoMap, ...cargoDesired, paxBagWeight]);

    const processZfw = useCallback((newZfw) => {
        let paxCargoWeight = newZfw - emptyWeight;

        // Load pax first
        const pWeight = paxWeight + paxBagWeight;
        const newPax = Math.min(Math.round(paxCargoWeight / pWeight), maxPax);

        paxCargoWeight -= newPax * pWeight;
        const newCargo = Math.min(paxCargoWeight, maxCargo);

        setTargetPax(newPax);
        setTargetCargo(newPax, newCargo);
    }, [emptyWeight, paxWeight, paxBagWeight, maxPax, maxCargo]);

    const processGw = useCallback((newGw) => {
        let paxCargoWeight = newGw - emptyWeight - totalFuel;

        // Load pax first
        const pWeight = paxWeight + paxBagWeight;
        const newPax = Math.min(Math.round(paxCargoWeight / pWeight), maxPax);

        paxCargoWeight -= newPax * pWeight;
        const newCargo = Math.min(paxCargoWeight, maxCargo);

        setTargetPax(newPax);
        setTargetCargo(newPax, newCargo);
    }, [emptyWeight, paxWeight, paxBagWeight, maxPax, maxCargo, totalFuel]);

    const onClickCargo = useCallback((cargoStation, e) => {
        if (gsxPayloadSyncEnabled === 1 && boardingStarted) {
            return;
        }
        const cargoPercent = Math.min(Math.max(0, e.nativeEvent.offsetX / cargoMap[cargoStation].progressBarWidth), 1);
        setCargoDesired[cargoStation](Math.round(cargoMap[cargoStation].weight * cargoPercent));
    }, [cargoMap]);

    const onClickSeat = useCallback((stationIndex: number, seatId: number) => {
        if (gsxPayloadSyncEnabled === 1 && boardingStarted) {
            return;
        }

        // TODO FIXME: This calculation does not work correctly if user clicks on many seats in rapid succession
        const oldPaxBag = totalPaxDesired * paxBagWeight;
        const freight = Math.max(totalCargoDesired - oldPaxBag, 0);
        const seatFlags: SeatFlags = desiredFlags[stationIndex];
        seatFlags.toggleSeatId(seatId);
        setDesiredFlags[stationIndex](seatFlags);
        let newPaxDesired = 0;
        desiredFlags.forEach((flag) => {
            newPaxDesired += flag.getTotalFilledSeats();
        });

        setTargetCargo(newPaxDesired, freight);
    }, [
        paxBagWeight,
        totalCargoDesired,
        ...cargoDesired,
        ...desiredFlags, ...stationSize,
        totalPaxDesired,
    ]);

    const handleDeboarding = useCallback(() => {
        if (!boardingStarted) {
            showModal(
                <PromptModal
                    title={`${t('Ground.Payload.DeboardConfirmationTitle')}`}
                    bodyText={`${t('Ground.Payload.DeboardConfirmationBody')}`}
                    confirmText={`${t('Ground.Payload.DeboardConfirmationConfirm')}`}
                    cancelText={`${t('Ground.Payload.DeboardConfirmationCancel')}`}
                    onConfirm={() => {
                        setTargetPax(0);
                        setTargetCargo(0, 0);
                        setBoardingStarted(true);
                    }}
                />,
            );
        }
        setBoardingStarted(false);
    }, [totalPaxDesired, totalPax, totalCargo, boardingStarted, totalCargoDesired]);

    const calculateBoardingTime = useMemo(() => {
        // factors taken from payload.rs TODO: Simvar
        let boardingRateMultiplier = 0;
        if (boardingRate === 'REAL') {
            boardingRateMultiplier = 5;
        } else if (boardingRate === 'FAST') {
            boardingRateMultiplier = 1;
        }

        // factors taken from payload.rs TODO: Simvar
        const cargoWeightPerWeightStep = 60;

        const differentialPax = Math.abs(totalPaxDesired - totalPax);
        const differentialCargo = Math.abs(totalCargoDesired - totalCargo);

        const estimatedPaxBoardingSeconds = differentialPax * boardingRateMultiplier;
        const estimatedCargoLoadingSeconds = (differentialCargo / cargoWeightPerWeightStep) * boardingRateMultiplier;

        return Math.max(estimatedPaxBoardingSeconds, estimatedCargoLoadingSeconds);
    }, [totalPaxDesired, totalPax, totalCargoDesired, totalCargo, boardingRate]);

    const boardingStatusClass = useMemo(() => {
        if (!boardingStarted) {
            return 'text-theme-highlight';
        }
        return (totalPaxDesired * paxWeight + totalCargoDesired) >= (totalPax * paxWeight + totalCargo) ? 'text-green-500' : 'text-yellow-500';
    }, [boardingStarted, paxWeight, totalCargoDesired, totalCargo, totalPaxDesired, totalPax]);

    // Init
    useEffect(() => {
        if (paxWeight === 0) {
            setPaxWeight(Math.round(Loadsheet.specs.pax.defaultPaxWeight));
        }
        if (paxBagWeight === 0) {
            setPaxBagWeight(Math.round(Loadsheet.specs.pax.defaultBagWeight));
        }
    }, []);

    // Set Cold and Dark State
    useEffect(() => {
        if (simGroundSpeed > 0.1 || eng1Running || eng2Running || !isOnGround || (!busDC2 && !busDCHot1)) {
            setColdAndDark(false);
        } else {
            setColdAndDark(true);
        }
    }, [simGroundSpeed, eng1Running, eng2Running, isOnGround, busDC2, busDCHot1]);

    useEffect(() => {
        if (boardingRate !== 'INSTANT') {
            if (!coldAndDark) {
                setBoardingRate('INSTANT');
            }
        }
    }, [coldAndDark, boardingRate]);

    // Init the seating map
    useEffect(() => {
        const stationSize: number[] = [];
        for (let i = 0; i < seatMap.length; i++) {
            stationSize.push(0);
        }
        seatMap.forEach((station, i) => {
            stationSize[i] = station.capacity;
        });
        setStationLen(stationSize);
    }, [seatMap]);

    // Init the cargo map
    useEffect(() => {
        const cargoSize: number[] = [];
        for (let i = 0; i < cargoMap.length; i++) {
            cargoSize.push(0);
        }
        cargoMap.forEach((station, index) => {
            cargoSize[index] = station.weight;
        });
        setCargoStationWeight(cargoSize);
    }, [cargoMap]);

    useEffect(() => {
        if (gsxPayloadSyncEnabled === 1) {
            switch (gsxBoardingState) {
            // If boarding has been requested, performed or completed
            case gsxStates.REQUESTED:
            case gsxStates.PERFORMING:
            case gsxStates.COMPLETED:
                setBoardingStarted(true);
                break;
            default:
                break;
            }
        }
    }, [gsxBoardingState]);

    useEffect(() => {
        if (gsxPayloadSyncEnabled === 1) {
            switch (gsxDeBoardingState) {
            case gsxStates.REQUESTED:
                // If Deboarding has been requested, set target pax to 0 for boarding backend
                setTargetPax(0);
                setTargetCargo(0, 0);
                setBoardingStarted(true);
                break;
            case gsxStates.PERFORMING:
                // If deboarding is being performed
                setBoardingStarted(true);
                break;
            case gsxStates.COMPLETED:
                // If deboarding is completed
                setBoardingStarted(false);
                break;
            default:
                break;
            }
        }
    }, [gsxDeBoardingState]);

    useEffect(() => {
        let simbriefStatus = false;
        if (simbriefUnits === 'kgs') {
            simbriefStatus = (simbriefDataLoaded
                && (
                    simbriefPax !== totalPaxDesired
                    || Math.abs(simbriefFreight + simbriefBag * simbriefBagWeight - totalCargoDesired) > 3.0
                    || Math.abs(simbriefPaxWeight - paxWeight) > 3.0
                    || Math.abs(simbriefBagWeight - paxBagWeight) > 3.0
                )
            );
        } else {
            simbriefStatus = (simbriefDataLoaded
                && (
                    simbriefPax !== totalPaxDesired
                    || Math.abs(Units.poundToKilogram(simbriefFreight + simbriefBag * simbriefBagWeight) - totalCargoDesired) > 3.0
                    || Math.abs(Units.poundToKilogram(simbriefPaxWeight) - paxWeight) > 3.0
                    || Math.abs(Units.poundToKilogram(simbriefBagWeight) - paxBagWeight) > 3.0
                )
            );
        }

        if (gsxPayloadSyncEnabled === 1) {
            if (boardingStarted) {
                setShowSimbriefButton(false);
                return;
            }

            setShowSimbriefButton(simbriefStatus);
            return;
        }
        setShowSimbriefButton(simbriefStatus);
    }, [
        simbriefUnits,
        simbriefFreight,
        simbriefBag,
        simbriefBagWeight,
        paxWeight, paxBagWeight,
        totalPaxDesired, totalCargoDesired,
        simbriefDataLoaded,
        boardingStarted,
        gsxPayloadSyncEnabled,
    ]);

    const remainingTimeString = () => {
        const minutes = Math.round(calculateBoardingTime / 60);
        const seconds = calculateBoardingTime % 60;
        const padding = seconds < 10 ? '0' : '';
        return `${minutes}:${padding}${seconds.toFixed(0)} ${t('Ground.Payload.EstimatedDurationUnit')}`;
    };

    return (
        <div>
            <div className="relative h-content-section-reduced">
                <div className="mb-10">
                    <SeatMapWidget seatMap={seatMap} desiredFlags={desiredFlags} activeFlags={activeFlags} canvasX={146} canvasY={71} onClickSeat={onClickSeat} />
                </div>
                <CargoWidget cargo={cargo} cargoDesired={cargoDesired} cargoMap={cargoMap} cargoStationSize={cargoStationWeights} onClickCargo={onClickCargo} />

                <div className="flex relative right-0 flex-row justify-between px-4 mt-16">
                    <div className="flex flex-col flex-grow pr-24">
                        <div className="flex flex-row w-full">
                            <Card className="w-full col-1" childrenContainerClassName={`w-full ${simbriefDataLoaded ? 'rounded-r-none' : ''}`}>
                                <PayloadInputTable
                                    loadsheet={Loadsheet}
                                    emptyWeight={emptyWeight}
                                    massUnitForDisplay={massUnitForDisplay}
                                    gsxPayloadSyncEnabled={gsxPayloadSyncEnabled === 1}
                                    displayZfw={displayZfw}
                                    boardingStarted={boardingStarted}
                                    totalPax={totalPax}
                                    totalPaxDesired={totalPaxDesired}
                                    maxPax={maxPax}
                                    totalCargo={totalCargo}
                                    totalCargoDesired={totalCargoDesired}
                                    maxCargo={maxCargo}
                                    zfw={zfw}
                                    zfwDesired={zfwDesired}
                                    zfwCgMac={zfwCgMac}
                                    desiredZfwCgMac={desiredZfwCgMac}
                                    gw={gw}
                                    gwDesired={gwDesired}
                                    gwCgMac={gwCgMac}
                                    desiredGwCgMac={desiredGwCgMac}
                                    setTargetPax={setTargetPax}
                                    setTargetCargo={setTargetCargo}
                                    processZfw={processZfw}
                                    processGw={processGw}
                                    setDisplayZfw={setDisplayZfw}
                                />
                                <hr className="mb-4 border-gray-700" />
                                <div className="flex flex-row justify-start items-center">
                                    <MiscParamsInput
                                        disable={gsxPayloadSyncEnabled === 1 && boardingStarted}
                                        minPaxWeight={Math.round(Loadsheet.specs.pax.minPaxWeight)}
                                        maxPaxWeight={Math.round(Loadsheet.specs.pax.maxPaxWeight)}
                                        defaultPaxWeight={Math.round(Loadsheet.specs.pax.defaultPaxWeight)}
                                        minBagWeight={Math.round(Loadsheet.specs.pax.minBagWeight)}
                                        maxBagWeight={Math.round(Loadsheet.specs.pax.maxBagWeight)}
                                        defaultBagWeight={Math.round(Loadsheet.specs.pax.defaultBagWeight)}
                                        paxWeight={paxWeight}
                                        bagWeight={paxBagWeight}
                                        massUnitForDisplay={massUnitForDisplay}
                                        setPaxWeight={setPaxWeight}
                                        setBagWeight={setPaxBagWeight}
                                    />
                                    {gsxPayloadSyncEnabled !== 1 && (
                                        <BoardingInput boardingStatusClass={boardingStatusClass} boardingStarted={boardingStarted} totalPax={totalPax} totalCargo={totalCargo} setBoardingStarted={setBoardingStarted} handleDeboarding={handleDeboarding} />
                                    )}
                                </div>
                            </Card>

                            {showSimbriefButton
                                && (
                                    <TooltipWrapper text={t('Ground.Payload.TT.FillPayloadFromSimbrief')}>
                                        <div
                                            className={`flex justify-center items-center px-2 h-auto text-theme-body
                                                       hover:text-theme-highlight bg-theme-highlight hover:bg-theme-body
                                                       rounded-md rounded-l-none border-2 border-theme-highlight transition duration-100`}
                                            onClick={setSimBriefValues}
                                        >
                                            <CloudArrowDown size={26} />
                                        </div>
                                    </TooltipWrapper>
                                )}
                        </div>
                        {(gsxPayloadSyncEnabled !== 1) && (
                            <div className="flex flex-row mt-4">
                                <Card className="w-full h-full" childrenContainerClassName="flex flex-col w-full h-full">
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex font-medium">
                                            {t('Ground.Payload.BoardingTime')}
                                            <span className="flex relative flex-row items-center ml-2 text-sm font-light">
                                                (
                                                {remainingTimeString()}
                                                )
                                            </span>
                                        </div>

                                        <SelectGroup>
                                            <SelectItem
                                                selected={boardingRate === 'INSTANT'}
                                                onSelect={() => setBoardingRate('INSTANT')}
                                            >
                                                {t('Settings.Instant')}
                                            </SelectItem>

                                            <TooltipWrapper text={`${!coldAndDark ? t('Ground.Fuel.TT.AircraftMustBeColdAndDarkToChangeRefuelTimes') : ''}`}>
                                                <div>
                                                    <SelectItem
                                                        className={`${!coldAndDark && 'opacity-20'}`}
                                                        selected={boardingRate === 'FAST'}
                                                        disabled={!coldAndDark}
                                                        onSelect={() => setBoardingRate('FAST')}
                                                    >
                                                        {t('Settings.Fast')}
                                                    </SelectItem>
                                                </div>
                                            </TooltipWrapper>

                                            <div>
                                                <SelectItem
                                                    className={`${!coldAndDark && 'opacity-20'}`}
                                                    selected={boardingRate === 'REAL'}
                                                    disabled={!coldAndDark}
                                                    onSelect={() => setBoardingRate('REAL')}
                                                >
                                                    {t('Settings.Real')}
                                                </SelectItem>
                                            </div>
                                        </SelectGroup>
                                    </div>
                                </Card>

                                {/* <Card className="h-full w-fit" childrenContainerClassName="h-full w-fit rounded-r-none"> */}
                                {/* */}
                                {/* </Card> */}
                            </div>
                        )}
                    </div>
                    <div className="border border-theme-accent col-1">
                        <ChartWidget
                            width={525}
                            height={511}
                            envelope={Loadsheet.chart.performanceEnvelope}
                            limits={Loadsheet.chart.chartLimits}
                            cg={boardingStarted ? Math.round(gwCgMac * 100) / 100 : Math.round(desiredGwCgMac * 100) / 100}
                            gw={boardingStarted ? Math.round(gw) : Math.round(gwDesired)}
                            mldwCg={boardingStarted ? Math.round(gwCgMac * 100) / 100 : Math.round(desiredGwCgMac * 100) / 100}
                            mldw={boardingStarted ? Math.round(gw) : Math.round(gwDesired)}
                            zfwCg={boardingStarted ? Math.round(zfwCgMac * 100) / 100 : Math.round(desiredZfwCgMac * 100) / 100}
                            zfw={boardingStarted ? Math.round(zfw) : Math.round(zfwDesired)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
