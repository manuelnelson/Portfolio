<template>
  <div class="refresh" :class="{'fixed':isFixed}">
    <div class="circle blue"></div>
    <div class="circle purple"></div>
    <div class="circle pink"></div>
    <div class="circle red"></div>
    <div class="circle yellow"></div> 
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, ComponentOptionsBase} from "vue";

interface LoadingProps {
  isFixed?: boolean
}
export default defineComponent({
  props: {
    isFixed: Boolean
  },
  setup(props:Readonly<LoadingProps>) {
    const isFixed = props.isFixed
    return {isFixed};
  }
})
</script>

<style lang="stylus">
@keyframes refresh
  0%
    height: 18px
    transform: translateY(0)
  10%
    transform: translateY(20px)
  30%
  50%
    height: 10px
    transform: translateY(20px)
  20%
  40%
    height: 10px
    transform: translateY(10px)
  60%  
    transform: translateY(0px)
    opacity: 1
  68%
  100%
    transform: translateY(0)
    opacity: 0
.refresh
  display: flex
  justify-content: center
  height: 30px
  position relative
  z-index 20
  &.fixed
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
  .circle
    width: 10px
    height: 10px
    margin: 5px
    border-radius: 10px
    //box-shadow: 0px 1px 1px 1px #eee
    
    &.blue
      background-color: #17abd3
    &.purple
      background-color: #b14297
    &.pink
      background-color: #d92060
    &.red
      background-color: #f25622
    &.yellow
      background-color: #ffd062
      
  for i in (1..5)
    .circle:nth-child({i})
      animation: refresh 3s i * 0.1s infinite  
      
@keyframes move1
  4%
    transform: translateY(0)
  14%
  66%
    transform: translateY(30px)
  80%  
  100%
    transform: translateY(0)
    
@keyframes move2
  2%
    transform: translateY(0)
  12%
  68%
    transform: translateY(30px)
  80%  
  100%
    transform: translateY(0)
    
@keyframes move3
  0%
    transform: translateY(0)
  10%
  70%
    transform: translateY(30px)
  80%  
  100%
    transform: translateY(0)
</style>
