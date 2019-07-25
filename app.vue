<template>
    <div class="daily">
        <div class="daily-menu">
            <div class="daily-menu-item" :class="{on:type==='recommend'}" @click="handleToRecommend">每日推荐</div>
            <div class="daily-menu-item" :class="{on:type==='daily'}" @click="showThemes=!showThemes">主题日报</div>
            <div class="daily-menu-item" :class="{on:type==='hot'}" @click="handleToHot">热门消息</div>
            <ul v-show="showThemes">
                <li v-for="item in themes" :key="item.jd">
                    <a :class="{on:item.id==themeId && type==='daily'}" @click="handleToTheme(item.id)">{{item.name}}</a>
                </li>
            </ul>
        </div>
        <div class="daily-list" ref="list">
            <template v-if="type==='recommend'">
                <div v-for="(list,index) in recommendList" :key="index">
                    <div class="daily-date">{{formatDay(list.date)}}</div>
                    <Item v-for="item in list.stories" :data="item" :key="item.id" @click.native="handleClick(item.id)"></Item>
                </div>
            </template>
            <template v-if="type==='daily'">
                <Item v-for="item in list" :data="item" :key="item.id" @click.native="handleClick(item.id)"></Item>
            </template>
            <template v-if="type==='hot'">
                <Item v-for="item in hotList" :data="item" :key="item.news_id" @click.native="handleClick(item.news_id)"></Item>
            </template>
        </div>
        <daily-article :id="articleId"></daily-article>
    </div>
</template>

<script>
import $ from './libs/util';
import Item from './components/item.vue';
import DailyArticle from './components/daily-article.vue';

export default {
    components:{Item,DailyArticle},
    data(){
        return{
            themes:[],
            showThemes:false,
            type:'recommend',
            list:[],
            recommendList:[],
            themeId:0,
            dailyTime:$.getTodayTime(),
            isLoading:false,
            articleId:0,
            hotList:[]
        }
    },
    methods:{
        getThemes(){
            $.ajax.get('themes').then(res=>{
                this.themes=res.others;
            })
        },
        handleToTheme(id){
            this.type='daily';
            this.themeId=id;
            this.list=[];
            $.ajax.get('theme/'+id).then(res=>{
                this.list=res.stories.filter(item=>item.type!==1)
            });
        },
        handleToRecommend(id){
            this.type='recommend';
            this.recommendList=[];
            this.dailyTime=$.getTodayTime();
            this.getRecommendList();
        },
        getRecommendList(){
            this.isLoading=true;
            const prevDay=$.prevDay(this.dailyTime+86400000);
            // 获取前一天的推荐内容
            $.ajax.get('news/before/'+prevDay).then(res=>{
                this.recommendList.push(res);
                this.isLoading=false;
                return res;
            });
        },
        formatDay(date){
            let month=date.substr(4,2);
            let day=date.substr(6,2);
            if(month.substr(0,1)==='0') month=month.substr(1,1);
            if(day.substr(0,1)==='0') day=day.substr(1,1);
            return `${month}月${day}日`;
        },
        handleClick(id){
            this.articleId=id;
        },
        getHotList(){
            $.ajax.get('news/hot').then(res=>{
                this.hotList=res.recent;
            })
        },
        handleToHot(id){
            this.type='hot';
            this.hotList=[];
            this.getHotList();
        }
    },
    mounted(){
        this.getThemes();
        this.getRecommendList();
        // this.getHotList();
        const $list=this.$refs.list;
        // 监昕中栏的滚动事件
        $list.addEventListener('scroll',()=>{
            // 在“主题日报 || 热门消息”或正在加载推荐列表时停止操作
            if(this.type==='daily' || this.type==='hot' || this.isLoading) return;
            if($list.scrollTop+document.body.clientHeight>=$list.scrollHeight){
                this.dailyTime-=86400000;
                this.getRecommendList();
            }
        })
    },
    watch:{
        // 每日推荐数量不够达不到滚动加载的效果
        'recommendList.length': {
            handler(newValue, oldValue) {
                if (newValue <= 2) {
                    this.dailyTime-=86400000;
                    this.getRecommendList();
                }
            }
        }
    }
}
</script>


