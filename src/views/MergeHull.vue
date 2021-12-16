<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="subtitle">{{ msg }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-8">
        <div class="tile is-child box">
          <MergeHullCanvas :canvasId="'canvas-one'" ref="c" @message="getMessage" @lock="lock=true"
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
          <button class="button" @click.left="AddPoints" :disabled="lock"><strong> Add 10 </strong></button>
          <button class="button" @click.left="reset" :disabled="lock"><strong> Reset </strong></button>
          <button class="button" @click.left="last" :disabled="lock"><strong> Last </strong></button>
          <button class="button" @click.left="next" :disabled="lock"><strong> Next </strong></button>
          <button v-if="clickAuto" class="button is-primary" @click.left="auto"><strong> Auto </strong></button>
          <button v-else class="button" @click.left="auto"><strong> Auto </strong></button>
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
            <p class="content"> With the idea of pre-sort the point set, there is another algorithm called Merge Hull
              which also can determine the convex hull in <strong>O(nlogn)</strong> by divide and conquer the point set.
              Merge Hull algorithm divides the point set into left and right part and each part will be divided again
              till
              there is only few points left in the part such as 4 or 5 points. Since there is only few point, we can use
              brutal force to compute the little convex hull in constant time. For the conquer part, the algorithm will
              pick left and right
              parts that have already got convex hulls and try to connect two parts with upper and lower tangent lines.
              One way to find such tangent lines is starting with right most point on left convex hull and left most
              point
              on right convex hull and check points in CCW direction. Then, with the property of "left turn" in convex
              hull, we are going to make sure the
              connection of left and right convex hull is always turning left. After we merge all partial convex hulls,
              the final result is exactly the convex hull for the whole point set.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav";
import MergeHullCanvas from "../components/MergeHullCanvas";

export default {
  name: "MergeHull",
  components: {Nav, MergeHullCanvas},
  data() {
    return {
      msg: "Please add more than three points on our canvas first.",
      preface: true,
      lock: false,
      currentIndex: -1,
      clickAuto: false,
      autoing: false,
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
      let index = this.$refs.c.lastState();
      if (index !== null) {
        this.currentIndex = index;
      } else {
        this.currentIndex = 0;
        await this.$refs.c.prepare();
      }
      for (let i = 0; i < this.text.length; i++) {
        this.text[i].highLight = i === this.currentIndex;
      }
    },
    async next() {
      if (this.$refs.c.pointNum() <= 3) {
        return false;
      }
      if (this.currentIndex === -1) {
        this.currentIndex++;
        for (let i = 0; i < this.text.length; i++) {
          this.text[i].highLight = i === this.currentIndex;
        }
        await this.$refs.c.prepare();
      } else {
        let index = this.$refs.c.nextState();
        if (index !== null) {
          this.currentIndex = index;
          for (let i = 0; i < this.text.length; i++) {
            this.text[i].highLight = i === this.currentIndex;
          }
        } else {
          return false;
        }
      }
      return true;
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
    AddPoints() {
      this.autoing = false;
      if (this.$refs.c.pointNum() > 200) {
        this.msg = "Max point number has been set to 200."
        return;
      }
      if (this.$refs.c.randomGeneratePoints(10, 0, 800, 0, 600)) {
        this.msg = "Randomly add 10 points on canvas and all points have different x and y coordinates."
      }
    },
    async auto() {
      this.autoing = !this.autoing;
      if (this.autoing) {
        this.clickAuto = true;
        while (this.autoing) {
          try {
            await this.next()
          } catch (e) {
            break;
          }
          await new Promise(r => setTimeout(r, 100));
        }
        this.clickAuto = false;
        this.autoing = false;
      }
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
