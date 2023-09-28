<template>
	<view class="cart-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<!-- 选框 -->
		  <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
		  <!-- 商品图片 -->
			<div class="goods-pic">
				<image :src="goods.goods_small_logo || defaultPic"></image>
			</div>
			<!-- 商品详细 -->
			<view class="goods-info">
				<view class="top">
					{{goods.goods_name}}
				</view>
				<view class="bottom">
					<view class="price">￥{{goods.goods_price}}</view>
					<view class="number">
						<!-- 插槽 -->
						<slot name="number"></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-cart",
		// 定义 props 属性，用来接收外界传递到当前组件的数据
		props: {
			// 商品的信息对象
			goods: {
				type: Object,
				defaul: {},
			},
			// 是否展示图片左侧的 radio
			showRadio: {
				type: Boolean,
				// 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
				default:false,
			}
		},
		data() {
			return {
				// 默认的空图片
					defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
		methods: {
			// radio 组件的点击事件处理函数
			radioClickHandler() {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
				// 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
				this.$emit('radio-change', {
					// 商品的 Id
					goods_id:this.goods.goods_id,
					// 商品最新的勾选状态
					goods_state: !this.goods.goods_state
				})
			}
		}
	}
</script>

<style lang="scss">
.cart-item{
	margin: 0 20rpx;
	height: 200rpx;
	display: flex;
	justify-content: space-around;
	margin-bottom: 20rpx;
}
.goods-item-left {
  margin-right: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .goods-pic {
    height: 160rpx;
    display: block;
		border: 6rpx solid #ccc;
		border-radius: 10rpx;
		image{
			width: 180rpx;
			height: 100%;
		}
  }
}
.goods-info{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 160rpx;
	margin-left: 16rpx;
	.top{
		font-size: 32rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical
	}
	.bottom{
		display: flex;
		justify-content: space-between;
		.price{
			font-size: 38rpx;
			font-weight: 700;
			color: red;
		}
	}
}
</style>