import { useData } from 'vitepress';
import { computed } from 'vue';
import { getHomeUiText } from './homeUiText';

export function useHomeUiText() {
  const { site } = useData();

  return computed(() => getHomeUiText(site.value.lang));
}
