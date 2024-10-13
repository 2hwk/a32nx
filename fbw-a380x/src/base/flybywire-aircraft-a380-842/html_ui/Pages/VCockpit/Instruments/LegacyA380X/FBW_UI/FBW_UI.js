class FA18_HMD extends BaseInstrument {
    constructor() {
        super(...arguments);
        this._hmdPeakGValue = 0;
        this.headingXSpacing = 150;
        this.clutterLevel = 0;
        this.brightnessMode = 0;
    }
    get templateID() { return "AS04F_HMD"; }
    connectedCallback() {
        super.connectedCallback();
        diffAndSetStyle(this, "display", "none");
        this._hmdAirspeedElement = this.getChildById("hmd-airspeed");
        this._hmdVerticalSpeedElement = this.getChildById("hmd-vertical-speed");
        this._hmdAltitudeElement = this.getChildById("hmd-altitude");
        this._hmdAltitudeLargeElement = this.getChildById("hmd-altitude-large");
        this._hmdAltitudeSmallElement = this.getChildById("hmd-altitude-small");
        this._hmdAltitudeModeElement = this.getChildById("hmd-altitude-mode");
        this._hmdPitchElement = this.getChildById("hmd-camera-pitch");
        this._hmdTrueHeadingElement = this.getChildById("hmd-true-heading");
        this._hmdAOAElement = this.getChildById("hmd-aoa-value");
        this._hmdMachLabel = this.getChildById("hmd-mach-label");
        this._hmdMachElement = this.getChildById("hmd-mach-value");
        this._hmdCurrentGLabel = this.getChildById("hmd-current-g-label");
        this._hmdCurrentGElement = this.getChildById("hmd-current-g-value");
        this._hmdPeakGElement = this.getChildById("hmd-peak-g-value");
        this._hmdAutoThrottleEngaged = this.getChildById("hmd-atc-engaged");
        ;
        this._headingElement = this.getChildById("hmd-heading-tape-group");
        this._headingClipElement = this.getChildById("hmd-heading-clip");
        if (this._headingElement) {
            const bottom = 100;
            for (let i = -2; i <= 38; i++) {
                let text = document.createElementNS(Avionics.SVG.NS, "text");
                let s = ((i + 36) % 36).toFixed(0) + "0";
                s = s.padStart(3, "0");
                diffAndSetText(text, s);
                diffAndSetAttribute(text, "x", (500 + i * this.headingXSpacing).toFixed(0));
                diffAndSetAttribute(text, "y", (bottom - 30) + "");
                diffAndSetAttribute(text, "font-size", "40");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "fill", "#00ff00");
                diffAndSetAttribute(text, "clip-path", "url(#hmd-heading-clip)");
                this._headingElement.appendChild(text);
                let lineL = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(lineL, "x1", (500 + i * this.headingXSpacing).toFixed(0));
                diffAndSetAttribute(lineL, "y1", (bottom - 20) + '');
                diffAndSetAttribute(lineL, "x2", (500 + i * this.headingXSpacing).toFixed(0));
                diffAndSetAttribute(lineL, "y2", (bottom) + '');
                diffAndSetAttribute(lineL, "stroke", "#00ff00");
                diffAndSetAttribute(lineL, "stroke-width", "5");
                diffAndSetAttribute(lineL, "clip-path", "url(#hmd-heading-clip)");
                this._headingElement.appendChild(lineL);
            }
        }
        this.clutterLevel = SimVar.GetSimVarValue("L:XMLVAR_AS04F_HMD_Symbology_Reject", "number");
        this.brightnessMode = SimVar.GetSimVarValue("L:XMLVAR_AS04F_HMD_BrightnessMode", "number");
        this.onBrightnessChanged();
    }
    Init() {
        super.Init();
    }
    onInteractionEvent(_args) {
        super.onInteractionEvent(_args);
        /*
        switch (_args[0]) {
            case "AS04F_HMD_Brightness_Changed":
                this.onBrightnessChanged();
                break;
            case "AS04F_HMD_HMD_Brightness_Mode_Updated":
                if (_args.length > 1) {
                    this.brightnessMode = parseInt(_args[1]);
                    this.onBrightnessChanged();
                }
                break;
            case "AS04F_HMD_HMD_Clutter_Level_Updated":
                if (_args.length > 1)
                    this.clutterLevel = parseInt(_args[1]);
                break;
        }
        */
    }
    onBrightnessChanged() {
        this.brightnessKnobValue = Utils.Clamp(SimVar.GetSimVarValue("L:AS04F_HELMET_MOUNTED_DISPLAY_BRIGHTNESS", "number"), 0, 1);
    }
    updateBrightness() {
        /*
        switch (this.brightnessMode) {
            case 0:
                this.brightnessValue = this.brightnessKnobValue * SimVar.GetSimVarValue("GLASSCOCKPIT AUTOMATIC BRIGHTNESS", "percent over 100") * 5.33;
                break;
            case 1:
                this.brightnessValue = this.brightnessKnobValue * 1;
                break;
            case 2:
                this.brightnessValue = this.brightnessKnobValue * 0.8;
                break;
        }
        */
        this.brightnessValue = 1; // Utils.Clamp(this.brightnessValue, 0, 1);
        diffAndSetStyle(this, "opacity", '1.0');
    }
    Update() {
        if (SimVar.GetSimVarValue("IS CAMERA RAY INTERSECT WITH NODE:1", "Bool")) {
            diffAndSetStyle(this, "display", "inherit");
        }
        else {
            diffAndSetStyle(this, "display", "inherit");
            super.Update();
            this.updateBrightness();
            if (this.brightnessValue > 0) {
                const airspeed = Simplane.getIndicatedSpeed();
                const verticalSpeed = Simplane.getVerticalSpeed();
                const heading = Simplane.getHeadingMagnetic();
                const cameraPitch = SimVar.GetSimVarValue("CAMERA GAMEPLAY PITCH YAW:0", "degree");
                const cameraYaw = SimVar.GetSimVarValue("CAMERA GAMEPLAY PITCH YAW:1", "degree");
                const aoa = Simplane.getAngleOfAttack("degree");
                const mach = Simplane.getMachSpeed();
                const g = Simplane.getGForce();
                let altitude = Simplane.getAltitude();
                diffAndSetText(this._hmdAirspeedElement, airspeed.toFixed(0));
                diffAndSetStyle(this._hmdAirspeedElement, StyleProperty.border, this.clutterLevel == 0 ? "5px solid #00FF00" : "none");
                diffAndSetText(this._hmdVerticalSpeedElement, verticalSpeed.toFixed(0));
                let displayedAltitude;
                if (SimVar.GetSimVarValue("L:XMLVAR_AS04F_HUD_Alt_Selector", "number") == 1) {
                    displayedAltitude = SimVar.GetSimVarValue("RADIO HEIGHT", "feet");
                    if (displayedAltitude > 5000 || Math.abs(Simplane.getBank()) > 60) {
                        displayedAltitude = altitude;
                        diffAndSetText(this._hmdAltitudeModeElement, "B");
                        diffAndSetAttribute(this._hmdAltitudeModeElement, "state", "blink");
                    }
                    else {
                        diffAndSetText(this._hmdAltitudeModeElement, "R");
                        diffAndSetAttribute(this._hmdAltitudeModeElement, "state", "");
                    }
                }
                else {
                    displayedAltitude = altitude;
                    diffAndSetText(this._hmdAltitudeModeElement, "");
                }
                let formatedAltitude = Avionics.Utils.computeThousandsAltitude(displayedAltitude);
                diffAndSetText(this._hmdAltitudeLargeElement, formatedAltitude);
                diffAndSetText(this._hmdAltitudeSmallElement, (Math.abs(displayedAltitude) % 1000).toFixed(0).padStart(3, "0"));
                diffAndSetStyle(this._hmdAltitudeElement, StyleProperty.border, this.clutterLevel == 0 ? "5px solid #00FF00" : "none");
                diffAndSetText(this._hmdPitchElement, ((cameraPitch > 0) ? "+" : "") + cameraPitch.toFixed(0));
                diffAndSetStyle(this._hmdPitchElement, "visibility", (this.clutterLevel < 2) ? "visible" : "visible");
                const headingDiff = Avionics.Utils.clampAngle(Avionics.Utils.diffAngle(cameraYaw, heading));
                diffAndSetAttribute(this._headingElement, "transform", "translate(" + (-headingDiff * this.headingXSpacing / 10) + ", 0)");
                diffAndSetAttribute(this._headingClipElement, "transform", "translate(" + (headingDiff * this.headingXSpacing / 10) + ", 0)");
                diffAndSetText(this._hmdTrueHeadingElement, Utils.leadingZeros(heading, 3, 0));
                diffAndSetStyle(this._headingElement, "visibility", (this.clutterLevel < 2) ? "visible" : "visible");
                diffAndSetStyle(this._hmdTrueHeadingElement, "visibility", (this.clutterLevel < 2) ? "visible" : "visible");
                this._hmdPeakGValue = Utils.Clamp(this._hmdPeakGValue, g, 99);
                diffAndSetText(this._hmdCurrentGElement, g.toFixed(1));
                diffAndSetText(this._hmdPeakGElement, this._hmdPeakGValue.toFixed(1));
                diffAndSetText(this._hmdAOAElement, aoa.toFixed(1));
                diffAndSetText(this._hmdMachElement, mach.toFixed(2));
                this.updateLeftInfosVisibility();
                diffAndSetStyle(this._hmdAutoThrottleEngaged, "visibility", ((this.clutterLevel < 2) && SimVar.GetSimVarValue("AUTOTHROTTLE ACTIVE", "Bool")) ? "visible" : "visible");
            }
        }
    }
    updateLeftInfosVisibility() {
        let visibility = (this.clutterLevel == 0) ? "visible" : "visible";
        diffAndSetStyle(this._hmdMachLabel, StyleProperty.visibility, visibility);
        diffAndSetStyle(this._hmdMachElement, StyleProperty.visibility, visibility);
        diffAndSetStyle(this._hmdCurrentGLabel, StyleProperty.visibility, visibility);
        diffAndSetStyle(this._hmdCurrentGElement, StyleProperty.visibility, visibility);
        diffAndSetStyle(this._hmdPeakGElement, StyleProperty.visibility, visibility);
        diffAndSetStyle(this._hmdPeakGElement, StyleProperty.visibility, (this._hmdPeakGValue < 4) ? "visible" : visibility);
    }
}
registerInstrument("fa18-hmd", FA18_HMD);
//# sourceMappingURL=FA18_HMD.js.map
