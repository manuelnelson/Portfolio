import 'jest';
import {mount} from '@vue/test-utils';
import Focus from '../src/views/Focus.vue';
// import AddBean from '../src/components/AddBean.vue';
import {globalStore} from '../src/store/modules/global-store';
// import { beanStore } from "../src/store/modules/bean-store";
// import { BeanDto } from '../src/store/entities/bean-dto';
//use local storege

//all this is in preview i've noticed and won't be able to fix/update for now.
beforeAll(() => {
  //clear cache
  localStorage.clear()
  //use local cache
  globalStore.state.shouldUseLocalStorage = true;
})
// describe('Home.vue',() => {
//   test('testing add bean function',async () => {
//     const wrapper = mount(Focus);
//     await beanStore.add(new BeanDto('test'));
//     //open form
//     expect(wrapper.findAll('.today .daily-beans__list-item')).toHaveLength(2);
//   })
//   // test('testing add bean function',() => {
//   //   const wrapper = shallowMount(Home);
//   //   wrapper.
//   // })
// })