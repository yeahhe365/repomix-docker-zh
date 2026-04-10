import { computed } from 'vue';
import { useData } from 'vitepress';
import { getHomeUiText } from './homeUiText';

export function useHomeUiText() {
  const { site } = useData();

  return computed(() => getHomeUiText(site.value.lang));
}
