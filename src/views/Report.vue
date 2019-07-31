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
      {{data}}
      </div>
  </div>
</template>
<script>
import firebase from '@/firebase'
export default {
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
          });
          let projectRef = tasktRef.parent.parent;
          let promiseProject = projectRef.get().then(register => {
            const aux = register.data();
            time.projectName = aux.name;
          });

          Promise.all([promiseProject,promiseTask]).then(() => {
            this.data.push(time);
          });

      });
     });

    }
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

