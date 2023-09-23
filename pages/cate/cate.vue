<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧的（一级分类）滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height:wh + 'px'}">
				<block v-for="(item, index) in cateList" :key="item.cat_id">
					<view 
					class="left-scroll-view-item"
					:class="[index === active? 'active':'']"
					@click="activeChange(index)"
					>{{item.cat_name}}</view>
				</block>	
			</scroll-view>
			<!-- 右侧的（二级分类）滚动视图区域 -->
			<scroll-view scroll-y class="right-scroll-view" :style="{height:wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, index2) in cateLevel2" :key="item2.cat_level">
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view 
						class="cate-lv3-item" 
						v-for="(item3, index3) in item2.children" 
						:key="item3.cat_id"
						@click="gotoGoodsList(item3)"
						>
							<!-- 图片 -->
							<!-- <image :src="item3.cat_icon.replace('ugo-dev','hmugo-web')"></image> -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh:0,
				// 当前选中项的索引，默认让第一项被选中
				active:0,
				// 一级分类数据列表
				cateList:[],
				// 二级分类列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop:0
			};
		},
		onLoad(options) {
			// 获取系统的高度
			this.getSystemHeight()
			// 调用获取分类列表数据的方法
			this.getCateList()
		},
		methods: {
			
			getSystemHeight() {
				// 获取当前系统的信息
				const systemInfo = uni.getSystemInfoSync()
				console.log(systemInfo)
				// 为 wh 窗口可用高度动态赋值
				this.wh = systemInfo.windowHeight
			},
			
			async getCateList() {
				// 发起请求
				const { data: res } = await uni.$http.get('/api/public/v1/categories')
				// 判断是否获取失败
				console.log(res)
				if(res.meta.status !== 200) return uni.$showMag()
				 // 转存数据
				this.cateList = res.message
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			
			activeChange(index) {
				// 选中项改变的事件处理函数
				this.active = index
				// 为二级分类列表重新赋值
				this.cateLevel2 = this.cateList[index].children
				
				// 让 scrollTop 的值在 0 与 1 之间切换,必须改变才会更新，所以需要1切换
				this.scrollTop = this.scrollTop === 0?1:0
			},
			
			// 点击三级分类项跳转到商品列表页面
			gotoGoodsList(item3) {
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container{
	display: flex;
	
	.left-scroll-view{
		width: 240rpx;
		
		&-item{
			line-height: 120rpx;
			background-color: #f7f7f7;
			text-align: center;
			font-size: 30rpx;
			
		}
		// 激活项的样式
		&-item.active{
			background-color: #ffffff;
			position: relative;
			// 渲染激活项左侧的红色指示边线
			&::before{
				content: '';
				display: block;
				width: 6rpx;
				height: 60rpx;
				background-color: #c00000;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	
	.right-scroll-view{
		.cate-lv2{
			&-title{
				font-size: 34rpx;
				font-weight: bold;
				text-align: center;
				padding: 15px 0;
			}
		}
		.cate-lv3-list{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			.cate-lv3-item{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-bottom: 30rpx;
				width: 33.3%;
				image{
					width: 120rpx;
					height: 120rpx;
				}
				text{
					font-size: 26rpx;
				}
			}
		}
	}
}
</style>
