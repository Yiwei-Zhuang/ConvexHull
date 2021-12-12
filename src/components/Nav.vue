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
        <router-link to="/Gift-Wrapping" class="navbar-item">Gift-Wrapping</router-link>
<!--        <a v-if="backRoomBtn" class="navbar-item" @click.left="backToRoom"> Back</a>-->
      </div>
<!--      <div class="navbar-end">-->
<!--        <div class="navbar-item">-->
<!--          <div class="buttons">-->
<!--            <button class="button is-light" @click.left="openLoginDialog($event)" v-if="!isLogin">-->
<!--              Log in-->
<!--            </button>-->
<!--            <button class="button is-light" @click.left="logout($event)" v-else>-->
<!--              Log out-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </nav>
</template>
<script>

export default {
  name: 'Nav',
  data() {
    return {
    }
  },
  created() {
    console.log("hehe")
  },
  methods: {
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
