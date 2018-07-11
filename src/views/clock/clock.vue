<template>
<div class="row" style="marginBottom: 20px">
    <div class="col-md-12 clock-tab">
        <b-tabs pills>
            <b-tab title="技师" active>
                <technician></technician>  
            </b-tab>
            <b-tab title="工位" >
                <station></station>
            </b-tab>
        </b-tabs>
    </div>
</div>
</template>
<script>
import Technician from './technician/technician'
import Station from './station/station'
export default {
    components: {
        Technician,
        Station
    },
}
</script>
<style>
.clock-tab .nav-item {
    width: 180px;
    height: 35px;
    text-align: center;
    line-height: 20px;
    background-color: #B2BEC6;
    border-radius: 3px; 
    margin-bottom: 10px;
    margin-right: 5px;
}
.clock-tab .nav-item a {
    font-size: 16px;
    color: #fff;
}

.clock-tab .nav-pills .nav-link.active {
    background-color: #fff;
    color: #67737B;
}
</style>
