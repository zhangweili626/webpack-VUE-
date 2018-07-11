<template>
    <div class="animated fadeIn" style="marginBottom: 20px">
        <car-tab></car-tab>
        <technician-station-tab></technician-station-tab>
    </div>
</template>
<script>
import CarTab from './carTab/carTab'
import TechnicianStationTab from './technician-station-tab/technician-station-tab'

export default {
    components: {
        CarTab,
        TechnicianStationTab
    },
}
</script>
<style>

</style>
