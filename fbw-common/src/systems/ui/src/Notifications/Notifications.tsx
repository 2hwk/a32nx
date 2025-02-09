import {
  ComponentProps,
  DisplayComponent,
  EventBus,
  FSComponent,
  Subject,
  SubscribableArray,
  VNode,
} from '@microsoft/msfs-sdk';
import { NotificationElement } from 'ui/src/Notifications/Notification';

interface NotificationRootProps extends ComponentProps {
  bus: EventBus;
  notifications: SubscribableArray<{ title: string; text: string }>;
}

export class NotificationsRoot extends DisplayComponent<NotificationRootProps> {
  private readonly gElementRef = FSComponent.createRef<SVGGElement>();

  private readonly svgElementRef = FSComponent.createRef<SVGSVGElement>();

  private readonly bus = this.props.bus;

  private readonly notifications = this.props.notifications;

  private visibilitySub = Subject.create('visible');

  get visible() {
    return this.visibilitySub.get();
  }

  onAfterRender(node: VNode): void {
    super.onAfterRender(node);
  }

  render(): VNode {
    console.log('Rendering notifications');
    console.log(this.notifications.length);
    return (
      this.notifications.length && (
        <NotificationElement
          x={50}
          y={100}
          title={this.notifications.get(0).title}
          text={this.notifications.get(0).text}
          visible={this.visibilitySub}
        />
      )
    );
  }
  // CringtelliJ is cringe
}
