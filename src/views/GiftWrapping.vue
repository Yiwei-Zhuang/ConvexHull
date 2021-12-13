<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="title">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <article class="tile is-child box">
          <PaperCanvas :type="3" :canvasId="'canvas-one'" ref="pc" @message="getMessage"/>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="block">
            Find lowest point
          </div>
          <div class="block">
            Draw a horizontal line cross the lowest point
          </div>
          <div class="block">
            Find lowest point
          </div>
          <div class="block">
            Find lowest point
          </div>
        </article>
      </div>
    </div>


    <div v-if="preface">
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card" style="max-width: 500px">
          <header class="modal-card-head">
            <p class="modal-card-title">Remember</p>
            <button class="delete" aria-label="close" @click.left="preface=false"></button>
          </header>
          <section class="modal-card-body">
            <p class="content">Remember in first section, we observe some points will definitely on the convex hull
              such as left,right,top,bottom-most points. In second section. ************************** *****************
              ************************************ ***************** ********************************** ***************
              *******************. Thus, we can start from a point that must be on the convex hull. Crossing that point,
              drawing a line that will not go through the convex hull of the point set. Rotating the line and stopping
              when it meets with another point. Gift-Wrapping could use this basic idea building a convex hull in
              <strong>O(n^2)</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav";
import PaperCanvas from "../components/PaperCanvas";

export default {
  components: {Nav, PaperCanvas},
  name: "GiftWrapping",
  data() {
    return {
      msg: "Let's pick the bottom point. Drawing a horizontal line. The horizontal line should not pass the convex hull because all other points are above it.",
      preface: true,
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

<style scoped>

</style>
