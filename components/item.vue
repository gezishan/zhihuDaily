<template>
    <a class="daily-item">
        <div class="daily-img" v-if="data.images || data.thumbnail">
            <img :src="imgPath+link" alt="">
        </div>
        <div class="daily-title" :class="{noImg:!data.images && !data.thumbnail}">{{data.title}}</div>
    </a>
</template>

<script>
import $ from '../libs/util';

export default {
    props:{
        data:{
            type:Object
        }
    },
    data(){
        return{
            imgPath:$.imgPath
        }
    },
    computed:{
        link(){
            return this.data.images ? this.data.images[0] : this.data.thumbnail
        } 
    }
}
</script>

