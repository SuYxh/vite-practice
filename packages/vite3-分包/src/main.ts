import Vue from 'vue';
import forEach from 'lodash/forEach';
import axios from 'axios';
// import ElementUI from 'element-ui';
// console.log('ElementUI', ElementUI);

console.log(Vue);

// 例如，你可能想要在用户进行某些操作时才加载某个模块
if (true) {
  import('element-ui').then((module) => {
    // 使用模块
    console.log('module', module);
  });
}


const arr = [1,2,3]

forEach(arr, (item: any) => {
  console.log(item);
})


axios.get('https://jsonplaceholder.typicode.com/posts/1')