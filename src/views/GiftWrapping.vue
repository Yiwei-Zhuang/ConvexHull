<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="title">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-8">
        <div class="tile is-child box">
          <PaperCanvas :type="3" :canvasId="'canvas-one'" ref="pc" @message="getMessage" @lock="lock=true"
                       @unlock="lock=false"/>
        </div>
      </div>
      <div class="tile is-vertical is-parent">
        <div class="tile is-child box" style="min-height: 600px; height: 600px;">
          <div style="margin-top: 150px">
            <div v-for="(item) in text" :key="item.message">
              <div v-if="item.highLight">
                <div class="block has-background-primary has-text-white">
                  {{ item.msg }}
                </div>
              </div>
              <div v-else>
                <div class="block mb-3">
                  {{ item.msg }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-child">
          <button class="button" @click.left="last" :disabled="lock"><strong> Last </strong></button>
          <button class="button" @click.left="next" :disabled="lock"><strong> Next </strong></button>
        </div>
      </div>
    </div>

    <div v-if="preface">
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card" style="max-width: 500px">
          <header class="modal-card-head">
            <p class="modal-card-title">Remember</p>
            <button class="delete" aria-label="close" @click.left="closePreface"></button>
          </header>
          <section class="modal-card-body">
            <p class="content">Remember in first section, we observe some points will definitely be on the convex hull
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
      msg: "Let's pick the bottom point first.",
      preface: true,
      lock: false,
      currentIndex: 0,
      text: [
        {
          msg: "Find lowest point",
          highLight: true,
        },
        {
          msg: "Draw a horizontal line cross the lowest point",
          highLight: false,
        },
        {
          msg: "Rotating the horizontal line in CCW direction and stop when it intersects with another point",
          highLight: false,
        },
        {
          msg: "Repeatedly find bounding lines",
          highLight: false,
        },
        {
          msg: "Clean up",
          highLight: false,
        }
      ],
    }
  },
  mounted() {

  },
  methods: {
    getMessage(msg) {
      this.msg = msg;
    },
    async next() {
      if (!this.lock && this.currentIndex < this.text.length - 1) {
        this.currentIndex += 1;
        for (let i = 0; i < this.text.length; i++) {
          if (i === this.currentIndex) {
            this.text[i].highLight = true;
          } else {
            this.text[i].highLight = false;
          }
        }
        await this.$refs.pc.show(this.currentIndex);
      }
    },
    async last() {
      if (!this.lock && this.currentIndex > 0) {
        this.currentIndex -= 1;
        for (let i = 0; i < this.text.length; i++) {
          if (i === this.currentIndex) {
            this.text[i].highLight = true;
          } else {
            this.text[i].highLight = false;
          }
        }
        await this.$refs.pc.show(this.currentIndex);
      }
    },
    async closePreface() {
      this.preface = false;
      await this.$refs.pc.show(this.currentIndex);
    },
  },
}
</script>

<style scoped>

</style>
