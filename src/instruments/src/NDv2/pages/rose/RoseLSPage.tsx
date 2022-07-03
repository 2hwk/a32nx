import { FSComponent, Subject, VNode } from 'msfssdk';
import { RoseMode, RoseModeProps } from './RoseMode';
import { Airplane } from '../../shared/Airplane';
import { TrackBug } from '../../shared/TrackBug';
import { RoseModeUnderlay } from './RoseModeUnderlay';

export class RoseLSPage extends RoseMode<RoseModeProps> {
    isVisible = Subject.create(false);

    render(): VNode | null {
        return (
            <g visibility={this.isVisible.map((v) => (v ? 'visible' : 'hidden'))}>
                <RoseModeUnderlay
                    heading={this.props.heading}
                    tcasMode={this.props.tcasMode}
                    rangeValue={this.props.rangeValue}
                    visible={this.isVisible}
                />

                <TrackBug
                    bus={this.props.bus}
                    isUsingTrackUpMode={this.props.isUsingTrackUpMode}
                />
                <Airplane
                    x={Subject.create(384)}
                    y={Subject.create(384)}
                    available={this.isVisible}
                    rotation={Subject.create(0)}
                />
            </g>
        );
    }
}
