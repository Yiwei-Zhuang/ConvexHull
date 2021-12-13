<template>
  <nav class="navbar container" role="navigation" aria-label="main navigation">
    <!--    <div class="navbar-brand">-->
    <!--      <a class="navbar-item" href="/">-->
    <!--        <strong class="is-size-4">Draw&Guess</strong>-->
    <!--      </a>-->
    <!--      <a-->
    <!--        role="button"-->
    <!--        class="navbar-burger burger"-->
    <!--        aria-label="menu"-->
    <!--        aria-expanded="false"-->
    <!--        data-target="navbarBasicExample"-->
    <!--      >-->
    <!--        <span aria-hidden="true"></span>-->
    <!--        <span aria-hidden="true"></span>-->
    <!--        <span aria-hidden="true"></span>-->
    <!--      </a>-->
    <!--    </div>-->
    <div id="navbar" class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Hello</router-link>
        <router-link to="/wheel" class="navbar-item">Wheel</router-link>
        <router-link to="/gift-wrapping" class="navbar-item">Gift-Wrapping</router-link>
        <!--        <a v-if="backRoomBtn" class="navbar-item" @click.left="backToRoom"> Back</a>-->
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button is-primary" @click.left="previous">
              Previous
            </button>
            <button class="button is-primary" @click.left="next">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>

export default {
  name: 'Nav',
  data() {
    return {
      pathList: ["/", "/wheel", "/gift-wrapping"],
    }
  },
  created() {
  },
  methods: {
    previous() {
      let currentPath = this.$route.path;
      for (let i = 1; i < this.pathList.length; i++) {
        if (currentPath === this.pathList[i]) {
          this.$router.push({
            path: this.pathList[i - 1],
          });
        }
      }
    },
    next() {
      let currentPath = this.$route.path;
      for (let i = 0; i < this.pathList.length - 1; i++) {
        if (currentPath === this.pathList[i]) {
          this.$router.push({
            path: this.pathList[i + 1],
          });
        }
      }
      // if (this.$route.path === "/") {
      //   this.$router.push({
      //     path: "/",
      //     name: 'lobby',
      //     params: {},
      //   });
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
nav {
  margin-top: 25px;
  margin-bottom: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #d88d00;
    }
  }
}
</style>
