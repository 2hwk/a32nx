import { ComponentProps, DisplayComponent, FSComponent, Subject, VNode } from '@microsoft/msfs-sdk';

interface NotificationProps extends ComponentProps {
  x: number;
  y: number;
  title: string;
  text: string;
  visible: Subject<string>;
}

export class NotificationElement extends DisplayComponent<NotificationProps> {
  private readonly gElementRef = FSComponent.createRef<SVGGElement>();

  private readonly svgElementRef = FSComponent.createRef<SVGSVGElement>();

  private readonly x = this.props.x;

  private readonly y = this.props.y;

  private readonly title = this.props.title;

  private readonly text = this.props.text;

  private readonly visible = this.props.visible;

  onAfterRender(node: VNode): void {
    super.onAfterRender(node);
  }

  render(): VNode {
    return (
      <div class="fade">
        <svg
          ref={this.svgElementRef}
          version="1.1"
          viewBox="0 0 1024 256"
          xmlns="http://www.w3.org/2000/svg"
          class="powered"
          visibility={this.visible}
        >
          <g ref={this.gElementRef} class="day">
            <path
              class="logo"
              d="M105 9H82.12365C77.73225 9 73.69155 11.39865 71.58885 15.2538L39 75.00015C29.16 93.00015 17.60745 99.00015 9 99.00015H87.00015L105 9Z"
              transform={'translate(' + this.x + ', ' + this.y + ')'}
            />
            <text x="250" y="135" class="fontMedium fontBold">
              {this.title}
            </text>
            <text x="250" y="175" class="fontSmall">
              {this.text}
            </text>
            <text x="250" y="205" class="fontSmall">
              {'It is the nickleback of flight sims'}
            </text>
          </g>
        </svg>
      </div>
    );
  }
  // CringtelliJ is cringe
}
