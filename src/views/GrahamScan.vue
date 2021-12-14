<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="title">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-8">
        <div class="tile is-child box">
          <PaperCanvas :type="4" :canvasId="'canvas-one'" ref="pc" @message="getMessage" @lock="lock=true"
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
            <p class="modal-card-title">Explanation</p>
            <button class="delete" aria-label="close" @click.left="closePreface"></button>
          </header>
          <section class="modal-card-body">
            <p class="content"> You may feel it is redundant to check and compare each line's slope for each point pair
              and yes, you are right. We can sort those points in a way so that we can efficiently compare them and
              prune out some point pairs which connections definitely could not be on the convex hull. Here is our next
              algorithm, Graham Scan. It sorts all points one time and use linear time to go through those ordered
              points and determine the convex hull in <strong>O(nlogn)</strong>.</p>
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
      msg: "Please add more than three points on our canvas first.",
      preface: true,
      lock: false,
      currentIndex: -1,
      text: [
        {
          msg: "Sort",
          highLight: false,
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
    async next() {
      if (!this.lock && this.$refs.pc.pointNum() > 3 && this.currentIndex < this.text.length - 1) {
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
    getMessage(msg) {
      this.msg = msg;
    },
    async closePreface() {
      this.preface = false;
    },
  }
}
</script>

<style scoped>

</style>
