<template>
  <div ref="chartContainer" style="width: 600px; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { diskData } from './diskData';

echarts.use([TitleComponent, TooltipComponent, TreemapChart, CanvasRenderer]);

// const ROOT_PATH = 'https://echarts.apache.org/examples';
const chartContainer = ref(null);
let myChart: any = null;


function getDiskData() {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(diskData)
    }, 1500);
  })
}

onMounted(() => {
  console.log('chartContainer.value', chartContainer.value);
  if (chartContainer.value) {
    myChart = echarts.init(chartContainer.value);
    myChart.showLoading();

    getDiskData()
      .then((diskData) => {
        myChart.hideLoading();

        const formatUtil = echarts.format;

        function getLevelOption() {
          return [
            {
              itemStyle: {
                borderWidth: 0,
                gapWidth: 5
              }
            },
            {
              itemStyle: {
                gapWidth: 1
              }
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                gapWidth: 1,
                borderColorSaturation: 0.6
              }
            }
          ];
        }

        myChart.setOption({
            title: {
              text: 'Disk Usage',
              left: 'center'
            },
            tooltip: {
              formatter: function (info: any) {
                var value = info.value;
                var treePathInfo = info.treePathInfo;
                var treePath = [];
                for (var i = 1; i < treePathInfo.length; i++) {
                  treePath.push(treePathInfo[i].name);
                }
                return [
                  '<div class="tooltip-title">' +
                  formatUtil.encodeHTML(treePath.join('/')) +
                  '</div>',
                  'Disk Usage: ' + formatUtil.addCommas(value) + ' KB'
                ].join('');
              }
            },
            series: [
              {
                name: 'Disk Usage',
                type: 'treemap',
                visibleMin: 300,
                label: {
                  show: true,
                  formatter: '{b}'
                },
                itemStyle: {
                  borderColor: '#fff'
                },
                levels: getLevelOption(),
                data: diskData
              }
            ]
          })
      });
  }
});
</script>
