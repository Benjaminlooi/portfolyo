import { DirectiveOptions } from 'vue';

import { elementInViewportOnce, elementInViewport } from '../helpers/element-viewport.helper';
import { ElementState } from '../providers/element-state.provider';

export default {
  bind(el, binding) {
    const elementState = new ElementState(el);

    (el as any).__scroll_subscription__ = elementInViewportOnce(
      elementState,
      typeof binding.value.offset === 'number'
        ? binding.value.offset
        : 0,
    ).subscribe(
        (visible) => {
          if (visible) {
            elementState.element.classList.add('visible-trigger--visible');
          }
        },
      );
  },
  unbind(el) {
    if ((el as any).__scroll_subscription__) {
      (el as any).__scroll_subscription__.unsubscribe();
    }
  },
} as DirectiveOptions;
