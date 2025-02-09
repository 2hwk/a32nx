import { ArraySubject, EventBus, FSComponent, GameStateProvider, HEventPublisher, Wait } from '@microsoft/msfs-sdk';
import { NotificationsRoot } from '@flybywiresim/notifications';

import './Notification.scss';

// eslint-disable-next-line camelcase
class A380X_Notifications extends BaseInstrument {
  private bus: EventBus;

  private readonly hEventPublisher: HEventPublisher;

  private readonly guid = `Notifications-${Utils.generateGUID()}`;

  private notifications = ArraySubject.create([
    {
      title: 'Paused At Top of Descent',
      text: 'I am a cool notification',
    },
  ]);

  /**
   * "mainmenu" = 0
   * "loading" = 1
   * "briefing" = 2
   * "ingame" = 3
   */
  private gameState = 0;

  constructor() {
    super();
    this.bus = new EventBus();
    this.hEventPublisher = new HEventPublisher(this.bus);
  }

  get templateID(): string {
    return 'A380X_Notifications';
  }

  public onInteractionEvent(args: string[]): void {
    this.hEventPublisher.dispatchHEvent(args[0]);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.hEventPublisher.startPublish();

    Promise.all([Wait.awaitSubscribable(GameStateProvider.get(), (state) => state === GameState.ingame, true)]).then(
      () => {
        FSComponent.render(
          <NotificationsRoot bus={this.bus} notifications={this.notifications} />,
          document.getElementById('Notifications_CONTENT'),
        );
        Coherent.trigger('UNFOCUS_INPUT_FIELD', this.guid);
      },
    );

    // Remove "instrument didn't load" text
    document?.getElementById('Notifications_CONTENT')?.querySelector(':scope > h1')?.remove();
    window.addEventListener('keydown', this.pressedAnyKey);
  }

  private pressedAnyKey = (event: KeyboardEvent): void => {
    console.log('Event detected:', event.type);
    console.log('Key', event.keyCode);
    if (event.keyCode === 32) {
      this.notifications.removeAt(0);
      console.log(this.notifications.length);
    }
  };

  public Update(): void {
    super.Update();

    if (this.gameState !== 3) {
      const gamestate = this.getGameState();
      if (gamestate === 3) {
        // this.simVarPublisher.startPublish();
      }
      this.gameState = gamestate;
    } else {
      // this.simVarPublisher.onUpdate();
    }
  }
}

registerInstrument('a380x-notifications', A380X_Notifications);
