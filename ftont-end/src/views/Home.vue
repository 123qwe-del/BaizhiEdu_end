<template>
  <div id="app">
    <Header></Header>
    <Banner></Banner>
    <Footer></Footer>
  </div>

</template>

<script>
import Header from '../components/headeer'
import Footer from '../components/footer'
import Banner from '../views/banner'

export default {
  name: "Home",
  components: {
    Header: Header,
    Footer: Footer,
    Banner: Banner,
  }
}
</script>

<style scoped>
#app {

}
</style>