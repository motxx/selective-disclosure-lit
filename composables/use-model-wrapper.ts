import { ref, watch } from 'vue';

export function useModelWrapper(props, propName) {
  const innerValue = ref(props[propName]);

  watch(
    () => props[propName],
    (newValue) => {
      innerValue.value = newValue;
    },
  );

  watch(innerValue, (newValue) => {
    if (props[propName] !== newValue) {
      props[propName] = newValue;
      emit('update:' + propName, newValue);
    }
  });

  return innerValue;
}
