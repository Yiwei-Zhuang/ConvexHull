<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="subtitle">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-8">
        <div class="tile is-child box">
          <PaperCanvas :type="4" :canvasId="'canvas-one'" ref="pc" @message="getMessage" @lock="lock=true"
                       @unlock="lock=false" @goto="goto"/>
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
            <p class="content"> You may feel it is redundant to check and compare each line's slope for each point pair
              and yes, you are right. We can sort those points in a way so that we can efficiently compare them and
              prune out some point pairs whose connections definitely could not be on the convex hull. Here is our next
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
  name: "GrahamScan",
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
          msg: "Handling lower hull",
          highLight: false,
        },
        {
          msg: "Pick last two elements in lower hull path, P1,P2, and next point from sorted point list as P3",
          highLight: false,
        },
        {
          msg: "Is P1P2P3 turn left?",
          highLight: false,
        },
        {
          msg: "Turn left! Add P3 to lower hull!",
          highLight: false,
        },
        {
          msg: "Turn right! Pop out P2! Reevaluate P3!",
          highLight: false,
        },
        {
          msg: "Finish lower hull",
          highLight: false,
        },
        {
          msg: "Finish upper hull",
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
        this.currentIndex = this.$refs.pc.lastState();
        for (let i = 0; i < this.text.length; i++) {
          this.text[i].highLight = i === this.currentIndex;
        }
      }
    },
    async next() {
      if (!this.lock && this.$refs.pc.pointNum() > 3 && this.currentIndex < this.text.length - 1) {
        let nextState = this.$refs.pc.nextState();
        if (nextState !== null) {
          this.currentIndex = nextState;
        } else {
          if (this.currentIndex === 2) {
            if (this.$refs.pc.endOfCheck()) {
              this.currentIndex = 6;
            } else {
              this.currentIndex = 3;
            }
          } else if (this.currentIndex === 3) {
            if (this.$refs.pc.currentTurn() < 0) {
              this.currentIndex = 4;
            } else {
              this.currentIndex = 5;
            }
          } else if (this.currentIndex === 4) {
            if (this.$refs.pc.endOfCheck()) {
              this.currentIndex = 6;
            } else {
              this.currentIndex = 2;
            }
          } else if (this.currentIndex === 5) {
            this.currentIndex = 2;
          } else {
            this.currentIndex += 1;
          }
          await this.$refs.pc.show(this.currentIndex);
        }
        for (let i = 0; i < this.text.length; i++) {
          this.text[i].highLight = i === this.currentIndex;
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
    goto(index) {
      this.currentIndex = index - 1;
    },
    async closePreface() {
      this.preface = false;
    },
  }
}
</script>

<style scoped>

</style>
