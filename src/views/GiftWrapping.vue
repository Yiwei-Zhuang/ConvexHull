<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="subtitle">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-8">
        <div class="tile is-child box">
          <GiftWrappingCanvas :canvasId="'canvas-one'" ref="c" @message="getMessage" @lock="lock=true"
                              @unlock="lock=false"/>
        </div>
      </div>
      <div class="tile is-vertical is-parent">
        <div class="tile is-child box" style="min-height: 500px; height: 500px;">
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
          <button class="button" @click.left="reset" :disabled="lock"><strong> Reset </strong></button>
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
            <p class="content">Remember in first section, we observe some points will definitely be on the convex hull
              such as left,right,top,bottom-most points. In second section. We observe that rotating "tangent lines" may
              be helpful for us to find convex hull. Gift-Wrapping is the very algorithm use this basic idea which can
              build a convex hull in <strong>O(n^2)</strong>. This algorithm starts from the bottom point and draws a
              horizontal line which could not go through the convex hull of the point set. Rotate the line CCW and
              stop when it meets with another point. Repeat this process till we go back the bottom point.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav";
import GiftWrappingCanvas from "../components/GiftWrappingCanvas";

export default {
  components: {Nav, GiftWrappingCanvas},
  name: "GiftWrapping",
  data() {
    return {
      msg: "Please add more than three points on our canvas first.",
      preface: true,
      lock: false,
      currentIndex: -1,
      clickAuto: false,
      text: [
        {
          msg: "Find lowest point",
          highLight: false,
        },
        {
          msg: "Rotate last tangent line CCW",
          highLight: false,
        },
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
      this.lock = true;
      if (this.$refs.c.pointNum() <= 3) {
        this.lock = false;
        return false;
      }
      if (this.currentIndex === -1) {
        this.currentIndex++;
        for (let i = 0; i < this.text.length; i++) {
          this.text[i].highLight = i === this.currentIndex;
        }
        this.$refs.c.prepare();
      } else {
        for (let i = 0; i < this.text.length; i++) {
          this.text[i].highLight = i === 1;
        }
        await this.$refs.c.nextState();
      }
      this.lock = false;
      return true;
    },
    async last() {
      this.lock = true;
      let index = await this.$refs.c.lastState();
      if (index !== null) {
        this.currentIndex = 1;
      } else {
        this.currentIndex = 0;
        await this.$refs.c.prepare();
      }
      for (let i = 0; i < this.text.length; i++) {
        this.text[i].highLight = i === this.currentIndex;
      }
      this.lock = false;
    },
    closePreface() {
      this.preface = false;
    },
    async reset() {
      this.currentIndex = -1;
      for (let i = 0; i < this.text.length; i++) {
        this.text[i].highLight = false;
      }
      this.msg = "Please add more than three points on our canvas first.";
      await this.$refs.c.reset();
      this.lock = false;
      this.clickAuto = false;
    },
  },
}
</script>

<style scoped>

</style>
