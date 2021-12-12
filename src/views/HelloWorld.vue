<template>
  <div>
    <Nav ref="nav" />
    <h1>{{ msg }}</h1>
    <PaperCanvas :canvasId="'canvas-one'" ref="pc"/>
  </div>
</template>

<script>
import PaperCanvas from "@/components/PaperCanvas";
import Nav from "../components/Nav";

export default {
  name: 'HelloWorld',
  components: {PaperCanvas, Nav},
  data() {
    return {
      msg: "Which points must be on convex hull when you first see this point set??"
    }
  },
  mounted() {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
canvas {
  border-color: #2c3e50;
}

</style>
