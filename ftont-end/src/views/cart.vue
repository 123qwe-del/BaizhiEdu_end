<template>
  <div class="cart">
    <Header></Header>
    <div class="cart_info">
      <div class="cart_title">
        <span class="text">我的购物车</span>
        <span class="total">共{{ cart_list.length }}门课程</span>
      </div>
      <div class="cart_table">
        <div class="cart_head_row">
          <span class="doing_row"></span>
          <span class="course_row">课程</span>
          <span class="expire_row">有效期</span>
          <span class="price_row">单价</span>
          <span class="do_more">操作</span>
        </div>
        <div class="cart_course_list">
          <Cartitem v-for="(course,index) in cart_list" :key="index" :course="course" @aaa="bbb"
          @add_up_to="add_up_to"
          ></Cartitem>
        </div>
        <div class="cart_footer_row">
          <span class="cart_select">
            <label>
              <el-checkbox @change="selectall" label="全选"></el-checkbox>
            </label>
          </span>
          <span class="cart_delete"><i class="el-icon-delete"></i> <span>删除</span></span>
          <span class="goto_pay"><router-link to="/order">去结算</router-link></span>
          <span class="cart_total" v-if="summation">总计：¥{{ parseFloat(summation).toFixed(2) }}</span>
          <span class="cart_total" v-else>总计：¥0</span>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/headeer";
import Footer from "@/components/footer";
import Cartitem from "@/components/Cartitem";

export default {
  name: "cart",
  data() {
    return {
      cart_list: [],  //回显数据
      id: "",
      checked: true,
      ids: [],  // 全选所用，存储当前页面id
      summation: 0,//合计价格列表
    }
  },
  created() {
    this.show_all()
  },
  methods: {
    //监听子组件
    bbb() {
      this.show_all()
    },
    // 显示所有信息
    show_all() {
      let token = localStorage.getItem("token")
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv5/cart/',
        method: 'get',
        headers: {
          "Authorization": "jwt " + token
        }
      }).then(res => {
        console.log(res.data)
        this.cart_list = res.data
        console.log(this.cart_list, 77777)
        this.$store.commit("add_cart", res.data.length)
        this.add_up_to()
      }).catch(error => {
        console.log(error)
      })
    },
    // 全选全不选
    selectall() {
      this.get_id()
      let token = localStorage.getItem("token")
      this.checked = !this.checked
      console.log(this.checked)
      this.$axios({
        url: 'http://127.0.0.1:8000/apiv5/select/',
        method: "patch",
        data: {
          id: this.ids,
          status: !this.checked,
        },
        headers: {
          "Authorization": "jwt " + token
        }
      }).then(res => {
        this.show_all()
        console.log(res.data)
        this.che = !this.che
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取当前课程id
    get_id() {
      this.ids = []
      for (let course = 0; course < this.cart_list.length; course++) {
        let id = this.cart_list[course].id
        this.ids.push(id)
      }
    },
    //合计价格
    add_up_to() {
      // this.show_all()
      this.summation = null
      let sumber = 0
      for (let i = 0; i < this.cart_list.length; i++) {
        if (this.cart_list[i].select){
          let sum = this.cart_list[i].discount_price
          console.log(sum,1191191119111919)
          sumber +=sum
          this.summation = sumber  // 把便利后得每个价格添加到列表中
        }
      }
      // this.show_all()
    },
  },
  components: {
    Header: Header,
    Footer: Footer,
    Cartitem: Cartitem
  }
}
</script>

<style scoped>
.cart_info {
  width: 1200px;
  margin: 0 auto 200px;
}

.cart_title {
  margin: 25px 0;
}

.cart_title .text {
  font-size: 18px;
  color: #666;
}

.cart_title .total {
  font-size: 12px;
  color: #d0d0d0;
}

.cart_table {
  width: 1170px;
}

.cart_table .cart_head_row {
  background: #F7F7F7;
  width: 100%;
  height: 80px;
  line-height: 80px;
  padding-right: 30px;
}

.cart_table .cart_head_row::after {
  content: "";
  display: block;
  clear: both;
}

.cart_table .cart_head_row .doing_row,
.cart_table .cart_head_row .course_row,
.cart_table .cart_head_row .expire_row,
.cart_table .cart_head_row .price_row,
.cart_table .cart_head_row .do_more {
  padding-left: 10px;
  height: 80px;
  float: left;
}

.cart_table .cart_head_row .doing_row {
  width: 78px;
}

.cart_table .cart_head_row .course_row {
  width: 530px;
}

.cart_table .cart_head_row .expire_row {
  width: 188px;
}

.cart_table .cart_head_row .price_row {
  width: 162px;
}

.cart_table .cart_head_row .do_more {
  width: 162px;
}

.cart_footer_row {
  padding-left: 30px;
  background: #F7F7F7;
  width: 100%;
  height: 80px;
  line-height: 80px;
}

.cart_footer_row .cart_select span {
  margin-left: -7px;
  font-size: 18px;
  color: #666;
}

.cart_footer_row .cart_delete {
  margin-left: 58px;
}

.cart_delete .el-icon-delete {
  font-size: 18px;
}

.cart_delete span {
  margin-left: 15px;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.cart_total {
  float: right;
  margin-right: 62px;
  font-size: 18px;
  color: #666;
}

.goto_pay {
  float: right;
  width: 159px;
  height: 80px;
  outline: none;
  border: none;
  background: #ffc210;
  font-size: 18px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>