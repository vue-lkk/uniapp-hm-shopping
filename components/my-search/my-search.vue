<template>
	<view 
	class="my-search-container" 
	:style="{'background-color':bgColor}"
	@click="searchHandler"
	>
		<view class="my-search-box" :style="{'border-radius': radius + 'rpx'}">
			<uni-icons type="search" size="20"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		props:{
			// 背景颜色
			bgColor:{
				type: String,
				default: '#C00000'
			},
			// 圆角尺寸
			radius:{
				type: Number,
				default: 35
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			searchHandler () {
				this.$emit('gotoSearch')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container{
	// background-color: #c00000;
	height: 100rpx;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
	.my-search-box{
		height: 72rpx;
		width: 100%;
		background-color: #ffffff;
		// border-radius: 35rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.placeholder{
		font-size: 30rpx;
		margin-left: 10rpx;
	}
}
</style>