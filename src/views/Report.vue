<template>
  <div class="report">
    <h1>Relatorio</h1>
    <form @submit.prevent='getData'>
      <div class="field is-grouped">
        <div class="control">
          <input class="input" type="date" v-model="dateStart"/>
        </div>
        <div class="control">
          <input class="input" type="date" v-model="dateEnd"/>
        </div>
        <div class="control">
          <button type="submit" class="button is-success">Buscar</button>
        </div>
      </div>
    </form>
    <div class="charts">
      {{dataTasks}}
    </div>
    <highcharts :options="lineChartOptions"></highcharts>
    <highcharts :options="pizzaChartOptions"></highcharts>
  </div>
</template>
<script>
import firebase from '@/firebase'

import Highcharts from 'highcharts'
//import HighchartsVue from 'highcharts-vue'
import {Chart} from 'highcharts-vue'


export default {
  components: {
    highcharts: Chart
  },
  data() {
    return {
      data: [],
      db: null,
      dateEnd: '',
      dateStart: '',
      // Nome do projeto
      // Nome da tarefa
      // Hora inicial
      // Tempo total
      // Membros
      //  Trabalho
    }
  },
  computed:{
    lineChartOptions(){
      let taskNames = [];
      let taskTotals = [];
      for (let i in this.dataTasks){
        taskNames.push(this.dataTasks[i].name);
        taskTotals.push(this.dataTasks[i].totalTime);
      };

      return {
        xAxis: {
          categories: taskNames,
        },
       series: [{
          data: taskTotals // sample data
        }]
      }
    },
    pizzaChartOptions(){
      let seriesData = [];
      for (let i in this.dataTasks){
        seriesData.push({
          name:this.dataTasks[i].name,
          y:this.dataTasks[i].totalTime,
        });
      }

      return {
        chart: {
          type: 'pie'
        },
        series: [{
          name: 'Tarefas',
         colorByPoint: true,
         data:  seriesData
       }]
      }
    },



    dataTasks(){
      let data = {};
      this.data.forEach(time=>{
        if(!data[time.taskId]) data[time.taskId] = {name:time.taskName,totalTime:0};
        let duration = time.dateEnd.toMillis() - time.dateStart.toMillis();
        let totalTime = duration/1000;
        data[time.taskId].totalTime += totalTime;
      });
      return data;
    },
    dataProjects(){
      let data = {};
      this.data.forEach(time=>{
        if(!data[time.projectId]) data[time.projectId] = {name:time.projectName,totalTime:0};
        let duration = time.dateEnd.toMillis() - time.dateStart.toMillis();
        let totalTime = duration/1000;
        data[time.projectId].totalTime += totalTime;
      });
      return data;
    }
  },
  methods: {
    getData() {
      this.data = [];
      const timesRef = this.db.collectionGroup('times');
      let start = new Date(`${this.dateStart} 00:00:00`);
      let end = new Date(`${this.dateEnd} 23:59:59`);
      console.log('getData');
      let query = timesRef.where('dateStart','>=',start).where('dateStart','<=',end);
      query.onSnapshot(query => {
        console.log('buscou algo');
        query.forEach(registerTime => {
          let time = registerTime.data();
          console.log(time);

          let tasktRef = registerTime.ref.parent.parent;
          let promiseTask = tasktRef.get().then(register => {
            const aux = register.data();
            time.taskName = aux.name;
            time.taskId = register.id;
          });
          let projectRef = tasktRef.parent.parent;
          let promiseProject = projectRef.get().then(register => {
            const aux = register.data();
            time.projectName = aux.name;
            time.projectId = register.id;
          });

          Promise.all([promiseProject,promiseTask]).then(() => {
            this.data.push(time);
          });

      });
     });

    },

  },
  mounted() {
    this.db = firebase.firestore();
    this.dateEnd = helpers.getCurrentDate();
    let auxDate = new Date();
    auxDate.setMonth(auxDate.getMonth() - 1);
    this.dateStart = helpers.getDate(auxDate);
    this.getData();

  }
}
</script>

