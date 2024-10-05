// Copyright (c) 2023-2024 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { render } from '@instruments/common/index';
import { AircraftContext, EfbWrapper, syncSettingsFromPersistentStorage } from '@flybywiresim/flypad';
import { A380FailureDefinitions } from '../../../failures';
import { AutomaticCallOutsPage } from './Pages/AutomaticCallOutsPage';
import { a380xSyncedSettings } from 'instruments/src/EFB/settingsSync';

import './Efb.scss';

function aircraftEfbSetup(): void {
  syncSettingsFromPersistentStorage(a380xSyncedSettings);
}

// TODO: Hoist failures context provider up to here
// This context provider will be replaced by a PluginBinder for fpadv4
render(
  <AircraftContext.Provider
    value={{
      performanceCalculators: {
        takeoff: null,
        landing: null,
      },
      pushbackPage: {
        turnIndicatorTuningDefault: 1.35,
      },
      settingsPages: {
        audio: {
          announcements: true,
          boardingMusic: true,
          engineVolume: true,
          masterVolume: true,
          windVolume: true,
          ptuCockpit: false,
          paxAmbience: true,
        },
        pinProgram: {
          paxSign: false,
          satcom: false,
          latLonExtend: false,
          rmpVhfSpacing: false,
        },
        realism: {
          mcduKeyboard: false,
          pauseOnTod: true,
          pilotAvatars: false,
        },
        sim: {
          cones: false,
          registrationDecal: false,
          wheelChocks: false,
        },
        throttle: {
          numberOfAircraftThrottles: 4,
          axisOptions: [1, 2, 4],
          axisMapping: [
            [[1, 2, 3, 4]], // 1
            [
              [1, 2],
              [3, 4],
            ], // 2
            [[1], [2], [3], [4]], // 4
          ],
        },
        autoCalloutsPage: AutomaticCallOutsPage,
      },
    }}
  >
    <EfbWrapper failures={A380FailureDefinitions} aircraftSetup={aircraftEfbSetup} />
  </AircraftContext.Provider>,
);
