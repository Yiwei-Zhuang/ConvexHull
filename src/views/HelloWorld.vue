<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="title">{{ msg }}</h1>
    <PaperCanvas :type="1" :canvasId="'canvas-one'" ref="pc" @message="getMessage"/>
  </div>
</template>

<script>
import PaperCanvas from "../components/PaperCanvas";
import Nav from "../components/Nav";

export default {
  name: 'HelloWorld',
  components: {PaperCanvas, Nav},
  data() {
    return {
      msg: "Intuitively, Which points must be on convex hull?"
    }
  },
  mounted() {

  },
  methods: {
    getMessage(msg) {
      this.msg = msg;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h1, h2 {*/
/*  font-weight: normal;*/
/*}*/

/*ul {*/
/*  list-style-type: none;*/
/*  padding: 0;*/
/*}*/

/*li {*/
/*  display: inline-block;*/
/*  margin: 0 10px;*/
/*}*/

/*a {*/
/*  color: #42b983;*/
/*}*/

</style>
