<template>
  <div class="alerts">
    <transition-group name="fade">
      <div class="alerts__item" :class="getClass(alert.type)" role="alert" v-for="(alert, ndx) in alerts" @click.stop="remove(alert)" :key="ndx" v-html="alert.message">
      </div>
    </transition-group>
  </div>
</template>
<script lang="ts">
import AlertStore  from '../store/modules/alert-store';
import { AlertType, Alert } from '../store/entities/alert';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  setup() {
    const alerts = computed(() => AlertStore.state.alerts);

    const getClass = (type: AlertType) : string  => {
      switch(type) {
        case AlertType.Warning:
          return 'alerts__warning';
        case AlertType.Error:
          return 'alerts__error';
        default:
          return 'alerts__info';
      }
    };
    const remove = (alert: Alert) => {
      AlertStore.removeAlert(alert);
    }
    return {alerts, getClass, remove};
  }
})

// export default defineComponent({

// })
</script>

<style lang="stylus">
@import "../assets/main.styl";
  .alerts
    width 100%;
    max-width 1200px;
    margin 0 auto
    left 50%
    transform translateX(-50%)
    font-size 20px
    position fixed
    z-index 1004
    top px-to-rem($header-height)
    a 
      color var(--primary);
    
    &__item
      display block;
      margin-bottom 10px;
      border-radius 10px;
      padding 8px 18px;
      cursor pointer
    &__error
      background-color #870404;
      color white;
    &__warning
      background-color #ff9933;
      color white;
    &__info
      background-color var(--secondary);
      color var(--primary);
      a 
        text-decoration underline
      

</style>
