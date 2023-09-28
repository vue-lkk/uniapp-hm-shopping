<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<my-search @gotoSearch="gotoSearch"></my-search>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的 item 项 -->
			<swiper-item v-for="(item,index) in swiperList" :key="item.goods_id">
				<!-- 动态绑定图片的 src 属性 -->
				<navigator class="swiper-item" :url="`/subpkg/goods-detail/goods-detail?goods_id='${item.goods_id}`">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			<!-- 	<navigator class="swiper-item" url="/subpkg/goods-detail/goods-detail" >
					<image :src="item.image_src" mode=""></image>
				</navigator> -->
			</swiper-item>
		</swiper>
		
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" 
			v-for="(item,index) in navList" 
			:key="index" 
			@click="navClickHandler(item)"
			>
				<image :src="item.image_src" class="nav-img" mode=""></image>
			</view>
		</view>
		
		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
				  <!-- 左侧大图片的盒子 -->
				  <navigator class="left-img-box" :url="item.product_list[0].url">
				    <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
				  </navigator>
				  <!-- 右侧 4 个小图片的盒子 -->
				  <view class="right-img-box">
				    <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
				      <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
				    </navigator>
				  </view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMixin from '@/mixins/tabbar-badge.js'
	
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMixin],
		data() {
			return {
				// 1. 轮播图的数据列表，默认为空数组
				swiperList:[],
				// 1. 分类导航的数据列表
				navList:[],
				// 1. 楼层的数据列表
				floorList: []
			};
		},
		onLoad() {
			// 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
			this.getSwiperList()
			// 2. 在 onLoad 中调用获取数据的方法
			this.getNavList()
			// 2. 在 onLoad 中调用获取楼层数据的方法
			this.getFloorList()
		},
		methods:{
			// nav-item 项被点击时候的事件处理函数
			navClickHandler(item){
				// 判断点击的是哪个 nav
				// console.log(item)
				switch(item.name) {
					case "分类": uni.switchTab({
						url:'/pages/cate/cate'
					})
					break;
					case "秒杀拍": uni.switchTab({
						url:'/pages/cate/cate'
					})
					break;
					case "超市购": uni.switchTab({
						url:'/pages/cate/cate'
					})
					break;
					case "母婴品": uni.switchTab({
						url:'/pages/cate/cate'
					})
					break
				}
			},
			
			// 3. 获取轮播图数据的方法
			async getSwiperList () {
				// 3.1 发起请求
				const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 3.2 请求失败
				// console.log(res)
				if(res.meta.status !== 200) {
					return uni.$showMsg()
				}
				this.swiperList = res.message
				uni.$showMsg('数据请求成功')
			},
			
			// 3. 在 methods 中定义获取数据的方法
			async getNavList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
				console.log(res)
				if(res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
			},
			
			// 3. 定义获取楼层列表数据的方法
			async getFloorList() {
				const { data: res} = await uni.$http.get('/api/public/v1/home/floordata')
				if(res.meta.status !== 200) return uni.$showMsg()
				// 通过双层 forEach 循环，处理 URL 地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			
			// 跳转到搜页
			gotoSearch () {
				uni.navigateTo({
					url:"/subpkg/search/search"
				})
			}
		}
	}
</script>

<style lang="scss">
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
}
swiper{
	height: 330rpx;
}
.swiper-item,
image{
	width: 100%;
	height: 100%;
}
.nav-list{
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 20rpx 0;
	.nav-item{
		width: 128rpx;
		height: 140rpx;
		.nav-img{
			width: 100%;
			height: 100%;
		}
	}
}

.floor-list{
	.floor-item{
		margin-left: 15rpx;
		.floor-title{
			height: 60rpx;
			width: 100%;
			display: flex;
		}
		.floor-img-box{
			display: flex;
			.right-img-box{
				display: flex;
				flex-wrap: wrap;
				justify-content:space-evenly;
			}
		}
	}
}
</style>
