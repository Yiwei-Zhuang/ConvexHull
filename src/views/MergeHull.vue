<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="subtitle">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-8">
        <div class="tile is-child box">
          <PaperCanvas :type="5" :canvasId="'canvas-one'" ref="pc" @message="getMessage" @lock="lock=true"
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
            <p class="content"> determine the convex hull in <strong>O(nlogn)</strong>.</p>
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
  name: "MergeHull",
  components: {Nav, PaperCanvas},
  data() {
    return {
      msg: "Please add more than three points on our canvas first.",
      preface: true,
      lock: false,
      currentIndex: -1,
      text: [
        {
          msg: "Sorting points by their X coordinate ascending",
          highLight: false,
        },
        {
          msg: "Divide",
          highLight: false,
        },
        {
          msg: "Brutal force compute convex hull"
        },
        {
          msg: "Merge",
          highLight: false,
        },
        {
          msg: "Find and connect upper and lower tangent lines",
          highLight: false,
        },
      ],
    }
  },
  async mounted() {
  },
  methods: {
    async last() {
      let index = this.$refs.pc.type5LastState();
      if (index !== null) {
        this.currentIndex = index;

      } else {
        this.currentIndex = 0;
        await this.$refs.pc.show(this.currentIndex);
      }
      for (let i = 0; i < this.text.length; i++) {
        this.text[i].highLight = i === this.currentIndex;
      }
    },
    async next() {
      if (this.currentIndex === -1) {
        this.currentIndex++;
        for (let i = 0; i < this.text.length; i++) {
          this.text[i].highLight = i === this.currentIndex;
        }
        await this.$refs.pc.show(0);
      } else {
        let index = this.$refs.pc.type5NextState();
        if (index !== null) {
          this.currentIndex = index;
          for (let i = 0; i < this.text.length; i++) {
            this.text[i].highLight = i === this.currentIndex;
          }
        }
      }
    },
    async reset() {
      this.currentIndex = -1;
      for (let i = 0; i < this.text.length; i++) {
        this.text[i].highLight = false;
      }
      this.msg = "Please add more than three points on our canvas first.";
      await this.$refs.pc.reset();
    },
    getMessage(msg) {
      this.msg = msg;
    },
    closePreface() {
      this.preface = false;
    },
  },
}
</script>

<style scoped>

</style>
