<template>
	<view>
		<!-- 使用 uni-ui 提供的搜索组件 -->
		<view class="search-box">
			<uni-search-bar
			v-model="keywork" 
			@input="input" 
			focus 
			cancelButton="none"
			></uni-search-bar>
		</view>
		
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults">
		  <view class="sugg-item" 
			v-for="(item, i) in searchResults"
			 :key="i" 
			 @click="gotoDetail(item.goods_id)">
		    <uni-icons type="search" size="15"></uni-icons>
				<view class="goods-name">{{item.goods_name}}</view>
		    <uni-icons type="arrowright" size="16"></uni-icons>
		  </view>
		</view>
		
		<!-- 历史搜索 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<view class="history-tap">
				<uni-tag 
				:text="item" 
				v-for="(item, index) in historyList" 
				:key="index" 
				@click="gotoDetail(item)"></uni-tag>
			</view>
		</view>

		<!-- 提示窗示例 -->
		<view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog 
				:type="msgType" 
				cancelText="关闭" 
				confirmText="确定" 
				title="提示!" 
				content="是否清除全部历史搜索记录" 
				@confirm="dialogConfirm"
				@close="dialogClose"
				></uni-popup-dialog>
			</uni-popup>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 搜索关键字
				keywork:'',
				// 定时器索引
				timer:null,
				// 搜索结果列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList:[]
			};
		},
		onLoad() {
			this.getSearchList()
			this.historyList = JSON.parse(uni.getStorageSync('historyList') || '[]')
		},
		methods: {
			input (e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.getSearchList()
				},500)
			},
			
			// 根据搜索关键词，搜索商品建议列表
			async getSearchList() {
				// 判断关键词是否为空
				if(this.keywork.trim().length < 0) {
					this.searchResults = []
					return
				}
				// 发起请求，获取搜索建议列表
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch',{ query: this.keywork })
				// if (res.meta.status !== 200) return uni.$showMsg()
				console.log(res)
				this.searchResults = res.message
				
				this.saveSearchHistory()
			},
			
			// 搜集历史搜索关键词
			saveSearchHistory() {
				const index = this.historyList.findIndex(item => item === this.keywork )
				// 判断是否已经存在关键词
				if(index !== -1) {
					this.historyList.splice(index,1)
				}
				// 判断是否输入关键字
				if(this.keywork.trim().length > 0) {
					this.historyList.unshift(this.keywork)
				}
				// 对历史搜索进行持久化存储
				uni.setStorageSync('historyList', JSON.stringify(this.historyList))
			},
			
			// 跳转到详情页
			gotoDetail(goods_id) {
				console.log(goods_id) 
			  uni.navigateTo({
			    // 指定详情页面的 URL 地址，并传递 goods_id 参数
			    url: '/subpkg/goods-detail/goods-detail?goods_id=' + goods_id
			  })
			},
			
			// 清除全部的历史记录
			cleanHistory (type) {
				// 显示弹出层
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			
			// 确定
			dialogConfirm() {
				// 清空 data 中保存的搜索历史
				this.historyList = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('historyList', '[]')
			},
			
			// 关闭
			dialogClose() {
				console.log('1')
			}
			
		}
	}
</script>

<style lang="scss">
.uni-searchbar{
	display: flex;
	/* #endif */
	flex-direction: row;
	position: relative;
	padding: 16rpx;
	background-color: #C00000;
}
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
}

.sugg-item{
	height: 100rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	border-bottom: 2rpx solid #ccc;
	.goods-name{
		white-space: nowrap;
		// 溢出部分隐藏
		overflow: hidden;
		// 文本溢出后，使用 ... 代替
		text-overflow: ellipsis;
		margin: 0 20rpx;
	}
}

.history-box{
	.history-title{
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		text{
			font-size: 34rpx;
			color: #ccc;
		}
	}
	.history-tap{
		text-align: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin: 20rpx;
		
	}
}
uni-tag{
	margin: 16rpx 12rpx;
}
</style>
