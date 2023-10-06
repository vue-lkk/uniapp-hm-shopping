<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 使用自定义的 address 组件 -->
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
		  <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 描述文本 -->
		  <text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					<my-cart 
					:goods="goods" 
					:show-radio="true"
					@radio-change="radioChangeHandler"
					>
						<template #number>
							<uni-number-box 
							:min="1" 
							background="#C00000" 
							color="#fff" 
							:value="goods.goods_count"
							@change="(val) => numberChangeHandler(val, goods)"
							@blur="(event) => numberBlur(event,goods)"
							></uni-number-box>
						</template>
					</my-cart>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 结算区域 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMixin from '@/mixins/tabbar-badge.js'
import { mapGetters } from 'vuex';
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMixin],
		data() {
			return {
				options:[
					{
						text: '删除',
						style: {
								backgroundColor: '#dd524d'
						}
					}
				]
			};
		},
		onLoad() {
			console.log('666',this.cart)
		},
		computed: {
			// 将 m_cart 模块中的 cart 数组映射到当前页面中使用
			...mapState('m_cart',['cart']),
		},
		methods: {
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			// addstr 是详细的收货地址
			...mapGetters('m_user',['addstr']),
			 // token 是用户登录成功之后的 token 字符串
			...mapState('m_user',['token']),
			// 商品的勾选状态发生了变化
			radioChangeHandler(goods) {
				this.updateGoodsState(goods)
			},
			// 按+，-修改数量
			numberChangeHandler(val,goods) {
				goods.goods_count = val
				this.updateGoodsCount(goods)
				// 调用mixins里的方法,更新购物车数量
				this.setBadge()
			},
			// 输入数量,失去焦点时调用
			numberBlur(event,goods) {
				if(+event.detail.value){
					goods.goods_count = Math.ceil(+event.detail.value)
					// 修改stroe数据
					this.updateGoodsCount(goods)
					// 调用mixins里的方法,更新购物车数量
					this.setBadge()
				}else{
					goods.goods_count = 1
					// 修改stroe数据
					this.updateGoodsCount(goods)
					// 调用mixins里的方法,更新购物车数量
					this.setBadge()
				}
			},
			// 点击了滑动操作的删除按钮
			swipeActionClickHandler(goods) {
				console.log('**',goods)
				this.removeGoodsById(goods)
				// 调用mixins里的方法,更新购物车数量
				this.setBadge()
			}
		}
	}
</script>

<style lang="scss">
.cart-container{
	padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}

.goods-item-left {
  margin-right: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .goods-pic {
    width: 100px;
    height: 100px;
    display: block;
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .empty-img {
    // width: 200rpx;
    // height: 200rpx;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
