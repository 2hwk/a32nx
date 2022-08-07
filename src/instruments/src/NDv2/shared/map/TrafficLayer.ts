import { NdTraffic } from '@shared/NavigationDisplay';
// import { MathUtils } from '@shared/MathUtils';
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

            this.paintIntruder(context, rx, ry, '#040405', 3.75);

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

            this.paintIntruder(context, rx, ry, '#ffffff', 1.6);

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

    private paintIntruder(context: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;

        const diamondHeight = 22;
        const diamondWidth = 12;

        context.translate(x, y);

        context.beginPath();
        context.moveTo(0, -diamondHeight / 2);
        context.lineTo(-diamondWidth / 2, 0);
        context.lineTo(0, diamondHeight / 2);
        context.lineTo(diamondWidth / 2, 0);
        context.lineTo(0, -diamondHeight / 2);
        context.stroke();

        context.closePath();
        context.resetTransform();
    }

    /*
    private paintNormIntruder() {
    }

    private paintSolidIntruder() {
    }

    private paintTaIntruder() {
    }

    private paintRaIntruder() {
    }
    */
}
