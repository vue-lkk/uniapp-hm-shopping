<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label for="rad" class="radio" @click="changeAllState">
			<radio id="rad" color="#c00000" value="123" :checked="isFullCheck"/>全选
		</label>
		<!-- 合计区域 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
import {mapGetters, mapMutations} from 'vuex'
	
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds:3,
				// 定时器的 Id
				timer: null
			};
		},
		computed: {
			// 1. 将 total 映射到当前组件中
			...mapGetters("m_cart",['checkedCount','total','checkedGoodsAmount']),
			...mapState('m_user',['token','address']),
			...mapState('m_cart',['cart']),
			// 2. 是否全选
			isFullCheck() {
				return this.total === this.checkedCount
			}
		},
		methods: {
			...mapMutations("m_cart",['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			// label 的点击事件处理函数
			changeAllState(event) {
				// 修改购物车中所有商品的选中状态
				// !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
				console.log(event)
			},
			
			// 点击了结算按钮
			settlement() {
				console.log(123)
				// 1. 先判断是否勾选了要结算的商品
				if(!this.checkedCount) return uni.$showMsg("请选择要结算的商品!")
				
				// 2. 再判断用户是否选择了收货地址
				// if(!this.addstr) return uni.$showMsg("请选择收货地址!")
				
				// 3. 最后判断用户是否登录了
				// if (!this.token) return uni.$showMsg('请先登录！')
				if (!this.token) return this.delayNavigate()
				
				// 4. 实现微信支付功能
				this.payOrder()
			},
			
			// 展示倒计时的提示消息
			showTips(n) {
				uni.showToast({
					icon:'none',
					title:'请登录后再结算!' + n + '秒后自动跳转到登录页面',
					// 为页面添加透明遮罩，防止点击穿透
					mask:true,
					duration:1500
				})
			},
			
			delayNavigate() {
				// 把 data 中的秒数重置成 3 秒
				this.seconds = 3
				// 1. 展示提示消息，此时 seconds 的值等于 3
				this.showTips(this.seconds)
				
				// 2. 创建定时器，每隔 1 秒执行一次
				this.timer = setInterval(() => {
					// 2 先让秒数自减 1
					this.seconds--
					if(this.seconds <= 0) {
						// 2.1 清除定时器
						clearInterval(this.timer)
						
						// 2.2 跳转到 my 页面
						uni.switchTab({
							url: '/pages/my/my',
							// 页面跳转成功之后的回调函数
							success:() => {
								// 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
								this.updateRedirectInfo({
									openType:'switchTab',
									// 从哪个页面跳转过去的
									from:'/pages/cart/cart'
								})
							}
						})
						
						// 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}
					// 2.2 再根据最新的秒数，进行消息提示
					this.showTips(this.seconds)
				},1000)
			},
			
			// 微信支付
			async payOrder() {
				// 1. 创建订单
				// 1.1 组织订单的信息对象
				const orderInfo = {
					// 开发期间，注释掉真实的订单价格，
					// order_price: this.checkedGoodsAmount,
					// 写死订单总价为 1 分钱
					order_price: 0.01,
					consignee_addr: "广州市天河区",
					goods: this.cart.filter(x => x.goods_state).map(x => ({ 'goods_id': x.goods_id, 'goods_number': x.goods_count, 'goods_price': x.goods_price }))
				}
				console.log('$$',orderInfo)
				// 1.2 发起请求创建订单
				const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				console.log(res)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 1.3 得到服务器响应的“订单编号”
				const orderNumber = res.message.order_number
				console.log('@1',orderNumber)
				
				// 2. 订单预支付
				// 2.1 发起请求获取订单的支付信息
				const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				// 2.2 预付订单生成失败
				if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
				// 2.3 得到订单支付相关的必要参数
				const payInfo = res2.message.pay
				console.log('@2',payInfo)
				
				// 3. 发起微信支付
				// 3.1 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				// 3.2 未完成支付
				if (err) return uni.$showMsg('订单未支付！')
				// 3.3 完成了支付，进一步查询支付的结果
				const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				// 3.4 检测到订单未支付
				if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 3.5 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
			 }
		}
	}
</script>

<style lang="scss">
.my-settle-container{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100rpx;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 10rpx;
	font-size: 28rpx;
	.radio{
		display: flex;
		align-items: center;
	}
	.amount{
		color: #C00000;
	}
	.btn-settle{
		height: 100rpx;
		min-width: 200rpx;
		background-color: #C00000;
		color: white;
		line-height: 100rpx;
		text-align: center;
		padding: 0 20rpx;
	}
}
</style>