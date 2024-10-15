import { ComponentProps, DisplayComponent, EventBus, FSComponent, VNode } from '@microsoft/msfs-sdk';

interface NotificationProps extends ComponentProps {
  bus: EventBus;
}

export class NotificationsRoot extends DisplayComponent<NotificationProps> {
  private readonly gElementRef = FSComponent.createRef<SVGGElement>();

  private readonly svgElementRef = FSComponent.createRef<SVGSVGElement>();

  onAfterRender(node: VNode): void {
    super.onAfterRender(node);
    window.addEventListener('keydown', this.pressedAnyKey);
  }

  private pressedAnyKey = (event: KeyboardEvent): void => {
    console.log('Key', event.keyCode);
  };

  render(): VNode {
    return (
      <svg
        ref={this.svgElementRef}
        version="1.1"
        viewBox="0 0 1024 256"
        xmlns="http://www.w3.org/2000/svg"
        class="powered"
      >
        <g ref={this.gElementRef} class="day">
          <path
            class="logo"
            d="M105 9H82.12365C77.73225 9 73.69155 11.39865 71.58885 15.2538L39 75.00015C29.16 93.00015 17.60745 99.00015 9 99.00015H87.00015L105 9Z"
            transform="translate(50, 100)"
          />
          <text x="250" y="135" class="fontMedium fontBold">
            {'Paused At Top of Descent'}
          </text>
          <text x="250" y="175" class="fontSmall">
            {'VSCode is just better'}
          </text>
        </g>
      </svg>
    );
  }
  //  CringtelliJ is cringe
}
