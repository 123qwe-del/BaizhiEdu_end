<template>
  <div class="cart_item" v-if="is_show">
    <div class="cart_column column_1">
      <el-checkbox class="my_el_checkbox" v-model="course.select" @change="change(course.id)"></el-checkbox>
    </div>
    <div class="cart_column column_2">
      <img :src="course.course_img" alt="">
      <span><router-link to="/course/detail/1">{{ course.name }}</router-link></span>
    </div>
    <div class="cart_column column_3">
      <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
        <el-option :label="item.expire_text" :value="item.id" v-for="(item, index) in course.expire_list" :key="index"></el-option>
      </el-select>
    </div>
    <div class="cart_column column_4" v-if="course.discount_price">¥{{ parseInt(course.discount_price) }}</div>
    <div class="cart_column column_4" v-else>¥{{ parseInt(course.price) }}</div>
    <div class="cart_column column_4" @click="deletecourse(course.id)">删除</div>
  </div>
</template>

<script>

export default {
  name: "Cartitem",
  props: ["course"],
  data() {
    return {
      show_list: [],
      is_show:true,
    }
  },
  //监听函数
  watch:{
    // 当course.expire_id发生改变的时候执行该函数
    "course.expire_id"(){
      console.log(this.course.expire_id)
      this.amenttime()
    },

  },
  methods: {
    //修改选中状态
    change(id) {
      let token = localStorage.getItem("token")
      console.log(1111)
      console.log(id)
      this.$axios({
        url: `http://127.0.0.1:8000/apiv5/select/${id}/`,
        method:'get',
        headers:{
          "Authorization": "jwt " + token
        }
      }).then(res =>{
        console.log(res.data)
        this.$emit('select_change',res.data.message)
        this.$emit('add_up_to',res.data.message)
      }).catch(error =>{
        console.log(error)
      })
    },
    //购物车删除按钮
    deletecourse(id){
      let token = localStorage.getItem("token")
      this.$axios({
        url:`http://127.0.0.1:8000/apiv5/select/${id}/`,
        method:'delete',
        headers:{
          "Authorization": "jwt " + token
        }
      }).then(res =>{
        console.log(res.data)
        this.$message({
          "message":"删除成功",
          type:'success',
          'duration': 2000
        })
        this.is_show=false
        this.$emit('add_up_to',res.data.message)
        this.$router.go("/cart")
      }).catch(error =>{
        console.log(error)
      })
    },
    // 购物车更改有效期
    amenttime(){
      console.log(this.key)
      let token = localStorage.getItem("token")
      this.$axios({
        url:"http://127.0.0.1:8000/apiv5/select/",
        method:'put',
        data:{
          id:this.course.id,
          expire:this.course.expire_id
        },
        headers:{
          "Authorization": "jwt " + token
        }
      }).then(res => {
        console.log(res.data)
        this.$message({
          "message": "修改成功",
          type: 'success',
          'duration': 2000
        })
        this.$emit('aaa',res.data.message)
        this.$emit('add_up_to',res.data.message)
      }).catch(error =>{
        console.log(error)
      })
    },
  }
}
</script>

<style scoped>
.cart_item::after {
  content: "";
  display: block;
  clear: both;
}

.cart_column {
  float: left;
  height: 250px;
}

.cart_item .column_1 {
  width: 88px;
  position: relative;
}

.my_el_checkbox {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  width: 16px;
  height: 16px;
}

.cart_item .column_2 {
  padding: 67px 10px;
  width: 520px;
  height: 116px;
}

.cart_item .column_2 img {
  width: 175px;
  height: 115px;
  margin-right: 35px;
  vertical-align: middle;
}

.cart_item .column_3 {
  width: 197px;
  position: relative;
  padding-left: 10px;
}

.my_el_select {
  width: 117px;
  height: 28px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}

.cart_item .column_4 {
  padding: 67px 10px;
  height: 116px;
  width: 142px;
  line-height: 116px;
}

</style>
