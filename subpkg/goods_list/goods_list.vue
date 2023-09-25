<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, index) in goodsList" :key="index" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 节流阀:是否正在请求数据
				isloading:false
			};
		},
		onLoad(options) {
			const {
				query,
				cid
			} = options
			this.queryObj.query = query || ''
			this.queryObj.cid = cid || ''

			this.getGoodsList()
		},
		methods: {
			async getGoodsList(cb) {
				// ** 打开节流阀
				this.isloading = true
				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				console.log(res)
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				// ** 关闭节流阀
				this.isloading = false
			},
			// 跳转到商品详情
			gotoDetail (goods) {
				console.log(goods)
				uni.navigateTo({
					url:`/subpkg/goods-detail/goods-detail?goods_id=${goods.goods_id}`
				})
			}
		},
		// 上拉加载更多
		onReachBottom(){
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("到底啦!")
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if (this.isloading) return
				
			// 让页码值自增 +1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = Math.ceil(Math.random()*10)
			this.total = 0
			this.isloading = false
			this.goodsList = []
			
			// 2. 重新发起请求,请求成功后回调停止刷新
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
.goods-list{
	.goods-item{
		margin: 20rpx;
		border: 2rpx solid #ccc;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.goods-item-left{
			display: flex;
			justify-content: center;
			align-items: center;
			.goods-pic{
				width: 90%;
				height: 600rpx;
				margin-top: 20rpx;
				border-radius: 15rpx;
			}
		}
		.goods-item.right{
			background-color: #C00000;
			color: #fff;
			padding: 20rpx;
			border: none;
			.goods-name{
				font-size: 32rpx;
			}
			.goods-info-box{
				display: flex;
				justify-content: center;
				margin-top: 20rpx;
				background-color: #fff;
				.goods-price{
					color: #C00000;
					font-weight: bold;
				}
			}
		}
	}
}
</style>