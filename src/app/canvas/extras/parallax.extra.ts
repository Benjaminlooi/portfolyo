import { ScrollerService } from '~~/services/scroller.service';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';
import { parallaxHelper } from '~~/helpers/parallax.helper';

export interface ParallaxConfig extends ContainerExtraConfig {
  speed: number;
  direction: 'x' | 'y';
}

export const parallaxExtraName = 'parallax';

export class Parallax implements ContainerExtra {
  public name = parallaxExtraName;
  private scroller = ScrollerService.getInstance();
  private container = new PIXI.Container();
  private enabled: boolean = false;

  public constructor(
    protected target: PIXI.Container,
  ) {}

  public activate(config: Partial<ParallaxConfig> = {}) {
    if ( ! this.enabled) {
      this.target.children.slice().forEach((child) => {
        this.container.addChild(child);
      });

      this.target.addChild(this.container);

      this.scroller.scrollAnimation$.subscribe((state) => {
        const viewportHeight = this.scroller.containerHeight;
        const elementHeight = this.container.height;
        const elementPositionY = this.target.y;
        const translation = parallaxHelper(
          state.position.y,
          viewportHeight,
          elementHeight,
          elementPositionY,
          config.speed,
          config.direction,
        );

        this.container.x = translation.x;
        this.container.y = translation.y;
      });
    }
  }

  public deactivate(config: Partial<ParallaxConfig> = {}) {
    if (this.enabled) {
      this.container.children.forEach((child) => {
        this.target.addChild(child);
      });

      this.target.removeChild(this.container);
    }
  }
}
