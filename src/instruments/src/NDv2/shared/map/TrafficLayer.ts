import { NdTraffic } from '@shared/NavigationDisplay';
import { MathUtils } from '@shared/MathUtils';
import { MapLayer } from './MapLayer';
import { MapParameters } from '../../../ND/utils/MapParameters';
// import { PaintUtils } from './PaintUtils';
import { CanvasMap } from './CanvasMap';

export class TrafficLayer implements MapLayer<NdTraffic> {
    public data: NdTraffic[] = [];

    constructor(private readonly canvasMap: CanvasMap) {
    }

    paintShadowLayer(context: CanvasRenderingContext2D, mapWidth: number, mapHeight: number, mapParameters: MapParameters) {
        for (const symbol of this.data) {
            const [x, y] = mapParameters.coordinatesToXYy({ lat: symbol.lat, long: symbol.lon });
            const rx = x + mapWidth / 2;
            const ry = y + mapHeight / 2;

            // this.paintIntruder(context, rx, ry, '#000', 3.75);

            /*
            if (symbol.type & NdSymbolTypeFlags.FlightPlan) {
                // this.paintFlightPlanWaypoint(false, context, rx, ry, symbol);
            } else if (symbol.type & NdSymbolTypeFlags.Airport || symbol.type & NdSymbolTypeFlags.Runway) {
                // this.paintAirport(false, context, rx, ry, symbol);
            } else {
                // this.paintWaypoint(false, context, rx, ry, symbol);
            }
            */
        }
    }

    paintColorLayer(context: CanvasRenderingContext2D, mapWidth: number, mapHeight: number, mapParameters: MapParameters) {
        for (const symbol of this.data) {
            const [x, y] = mapParameters.coordinatesToXYy({ lat: symbol.lat, long: symbol.lon });
            const rx = x + mapWidth / 2;
            const ry = y + mapHeight / 2;

            // this.paintIntruder(context, rx, ry, '#ff94ff', 1.75);

            /*
            if (symbol.type & NdSymbolTypeFlags.FlightPlan) {
                // this.paintFlightPlanWaypoint(true, context, rx, ry, symbol);
            } else if (symbol.type & NdSymbolTypeFlags.Airport || symbol.type & NdSymbolTypeFlags.Runway) {
                // this.paintAirport(true, context, rx, ry, symbol);
            } else {
                // this.paintWaypoint(true, context, rx, ry, symbol);
            }
            */
        }
    }

    /*
    private paintFlightPlanWaypoint(isColorLayer: boolean, context: CanvasRenderingContext2D, x: number, y: number, symbol: NdSymbol) {
        const mainColor = symbol.type & NdSymbolTypeFlags.ActiveLegTermination ? '#fff' : '#0f0';

        // this.paintWaypointShape(context, x, y, isColorLayer ? mainColor : '#000', isColorLayer ? 1.75 : 3.25);

        context.font = '21px Ecam';

        if (symbol.constraints) {
            // Circle

            if (isColorLayer) {
                if (symbol.type & NdSymbolTypeFlags.ConstraintMet) {
                    context.strokeStyle = '#ff94ff';
                } else if (symbol.type & NdSymbolTypeFlags.ConstraintMissed) {
                    context.strokeStyle = '#e68000';
                } else {
                    context.strokeStyle = '#fff';
                }
            } else {
                context.strokeStyle = '#000';
            }

            context.beginPath();
            context.ellipse(x, y, 14, 14, 0, 0, Math.PI * 2);
            context.stroke();
            context.closePath();
        }

        PaintUtils.paintText(isColorLayer, context, x + 13, y + 18, symbol.ident, mainColor);
    }

    private paintWaypoint(isColorLayer: boolean, context: CanvasRenderingContext2D, x: number, y: number, symbol: NdSymbol) {
        this.paintWaypointShape(context, x, y, isColorLayer ? '#ff94ff' : '#000', isColorLayer ? 1.75 : 3.25);

        const px = this.canvasMap.pointerX;
        const py = this.canvasMap.pointerY;

        const TEXT_LENGTH = Math.max(110, symbol.ident.length * 13.5);
        if (px > x - 7 && px < x + 13 + TEXT_LENGTH && py > y - 10 && py < y + 22) {
            context.strokeStyle = '#0ff';
            context.lineWidth = 1.75;
            context.strokeRect(x - 7, y - 10, 10 + 13 + TEXT_LENGTH, 29);
        }

        context.font = '21px Ecam';

        PaintUtils.paintText(isColorLayer, context, x + 13, y + 18, symbol.ident, '#ff94ff');
    }

    private paintWaypointShape(context: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;

        context.translate(x, y);
        context.rotate(45 * MathUtils.DEGREES_TO_RADIANS);
        context.strokeRect(-4.5, -4.5, 9, 9);
        context.resetTransform();
    }
    */

    private paintIntruder(context: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;

        context.translate(x, y);
        context.rotate(45 * MathUtils.DEGREES_TO_RADIANS);
        context.strokeRect(-4.5, -4.5, 9, 9);
        context.resetTransform();
    }

    private paintNormIntruder() {
        console.log();
    }

    private paintSolidIntruder() {
        console.log();
    }

    private paintTaIntruder() {
        console.log();
    }

    private paintRaIntruder() {
        console.log();
    }
}
